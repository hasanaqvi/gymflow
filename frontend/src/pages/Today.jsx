import { useState, useEffect } from "react"
import {
  getExercises,
  createSession,
  addExerciseToSession,
  createSet,
  deleteSet,
  getSessions,
} from "../api"

const phases = ["Warmup", "Main", "Cardio", "Cooldown"]

const phaseColors = {
  Warmup:   { bg: "#EAF3DE", color: "#27500A", border: "#3B6D11" },
  Main:     { bg: "#EEEDFE", color: "#3C3489", border: "#534AB7" },
  Cardio:   { bg: "#FAEEDA", color: "#633806", border: "#854F0B" },
  Cooldown: { bg: "#E6F1FB", color: "#0C447C", border: "#185FA5" },
}

const focusOptions = ["Upper", "Lower"]

const RPE_OPTIONS = [
  { value: "Very Easy", abbr: "VE", text: "#15803d", bg: "#dcfce7" },
  { value: "Easy",      abbr: "E",  text: "#065f46", bg: "#d1fae5" },
  { value: "Medium",    abbr: "M",  text: "#92400e", bg: "#fef3c7" },
  { value: "Hard",      abbr: "H",  text: "#9a3412", bg: "#ffedd5" },
  { value: "Very Hard", abbr: "VH", text: "#991b1b", bg: "#fee2e2" },
]

function RpeBadge({ rpe }) {
  const opt = RPE_OPTIONS.find(o => o.value === rpe)
  if (!opt) return null
  return (
    <span style={{
      fontSize: "11px",
      fontWeight: "600",
      padding: "2px 7px",
      borderRadius: "10px",
      background: opt.bg,
      color: opt.text,
      whiteSpace: "nowrap",
      letterSpacing: "0.02em",
    }}>
      {opt.abbr}
    </span>
  )
}

function todayStr() {
  return new Date().toISOString().split("T")[0]
}

function formatDisplayDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  })
}

function navigateDate(dateStr, delta) {
  const [y, m, d] = dateStr.split("-").map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + delta)
  return dt.toISOString().split("T")[0]
}

function getTheme(darkMode) {
  return {
    cardBg:         darkMode ? "#1e293b" : "#fff",
    cardBorder:     darkMode ? "#334155" : "#eee",
    inputBg:        darkMode ? "#0f172a" : "#fff",
    inputBorder:    darkMode ? "#334155" : "#ddd",
    textPrimary:    darkMode ? "#f1f5f9" : "#1a1a1a",
    textSecondary:  darkMode ? "#94a3b8" : "#888",
    rowBg:          darkMode ? "#0f172a" : "#fafafa",
    btnGhostBg:     darkMode ? "#1e293b" : "#fff",
    btnGhostBorder: darkMode ? "#334155" : "#ddd",
    btnGhostColor:  darkMode ? "#cbd5e1" : "#333",
  }
}

function Today({ darkMode, isMobile }) {
  const t = getTheme(darkMode)

  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [exercises, setExercises] = useState([])
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [dateLoading, setDateLoading] = useState(false)

  const [focus, setFocus] = useState("Upper")
  const [energyLevel, setEnergyLevel] = useState(3)
  const [notes, setNotes] = useState("")
  const [durationMins, setDurationMins] = useState("")

  const [activePhase, setActivePhase] = useState("Main")
  const [selectedExercise, setSelectedExercise] = useState("")
  const [setInputs, setSetInputs] = useState({})

  // Initial load
  useEffect(() => {
    Promise.all([getExercises(), getSessions()]).then(([exRes, seRes]) => {
      setExercises(exRes.data)
      setSession(seRes.data.find(s => s.date === selectedDate) || null)
      setLoading(false)
    })
  }, [])

  // Reload session whenever date changes (after initial load)
  useEffect(() => {
    if (loading) return
    setDateLoading(true)
    setSetInputs({})
    getSessions().then(res => {
      setSession(res.data.find(s => s.date === selectedDate) || null)
      setDateLoading(false)
    })
  }, [selectedDate])

  async function handleCreateSession() {
    setCreating(true)
    const res = await createSession({
      date: selectedDate,
      focus,
      energy_level: energyLevel,
      notes,
      duration_mins: durationMins ? parseInt(durationMins) : 0,
    })
    setSession(res.data)
    setCreating(false)
  }

  async function handleAddExercise() {
    if (!selectedExercise) return
    const res = await addExerciseToSession(session.id, {
      exercise_id: parseInt(selectedExercise),
      phase: activePhase,
      order_index: session.session_exercises?.length || 0,
      session_id: session.id,
    })
    setSession(prev => ({
      ...prev,
      session_exercises: [...(prev.session_exercises || []), res.data],
    }))
    setSelectedExercise("")
  }

  async function handleAddSet(sessionExerciseId) {
    const input = setInputs[sessionExerciseId] || {}
    await createSet({
      session_exercise_id: sessionExerciseId,
      reps: parseInt(input.reps) || 0,
      weight_kg: parseFloat(input.weight_kg) || 0,
      duration_secs: parseInt(input.duration_secs) || 0,
      rpe: input.rpe || null,
    })
    const seRes = await getSessions()
    const updated = seRes.data.find(s => s.date === selectedDate)
    if (updated) setSession(updated)
    setSetInputs(prev => ({ ...prev, [sessionExerciseId]: {} }))
  }

  async function handleDeleteSet(setId, sessionExerciseId) {
    await deleteSet(setId)
    setSession(prev => ({
      ...prev,
      session_exercises: prev.session_exercises.map(se => {
        if (se.id !== sessionExerciseId) return se
        return { ...se, sets: se.sets.filter(s => s.id !== setId) }
      }),
    }))
  }

  function updateSetInput(sessionExerciseId, field, value) {
    setSetInputs(prev => ({
      ...prev,
      [sessionExerciseId]: { ...(prev[sessionExerciseId] || {}), [field]: value },
    }))
  }

  const filteredExercises = exercises.filter(ex => {
    if (activePhase === "Main") return ex.category === session?.focus
    return ex.category === activePhase || ex.session_type === activePhase
  })

  const sessionExercisesByPhase = phases.reduce((acc, phase) => {
    acc[phase] = (session?.session_exercises || []).filter(se => se.phase === phase)
    return acc
  }, {})

  if (loading) return <p style={{ color: t.textSecondary }}>Loading...</p>

  const isToday = selectedDate === todayStr()
  const cardPad = isMobile ? "16px" : "20px 24px"

  const inputStyle = {
    padding: "9px 12px",
    borderRadius: "8px",
    border: `1px solid ${t.inputBorder}`,
    fontSize: "14px",
    background: t.inputBg,
    color: t.textPrimary,
    width: "100%",
  }

  const btnPrimary = {
    padding: "9px 20px",
    borderRadius: "8px",
    border: "1px solid #534AB7",
    background: "#534AB7",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    minHeight: "44px",
  }

  const btnSecondary = {
    padding: "9px 20px",
    borderRadius: "8px",
    border: "1px solid #534AB7",
    background: "#EEEDFE",
    color: "#3C3489",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    minHeight: "44px",
    whiteSpace: "nowrap",
  }

  const btnGhost = {
    padding: "7px 14px",
    borderRadius: "8px",
    border: `1px solid ${t.btnGhostBorder}`,
    background: t.btnGhostBg,
    color: t.btnGhostColor,
    fontSize: "14px",
    cursor: "pointer",
    minHeight: "44px",
    whiteSpace: "nowrap",
  }

  const card = {
    background: t.cardBg,
    borderRadius: "12px",
    border: `1px solid ${t.cardBorder}`,
    padding: cardPad,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "20px" : "28px" }}>

      {/* Date navigation */}
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "12px", color: t.textPrimary }}>
          {isToday ? "Today" : formatDisplayDate(selectedDate)}
        </h1>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}>
          <button
            onClick={() => setSelectedDate(d => navigateDate(d, -1))}
            style={{ ...btnGhost, padding: "7px 14px", minHeight: "36px", fontSize: "18px" }}
            title="Previous day"
          >
            ‹
          </button>
          <input
            type="date"
            value={selectedDate}
            max={todayStr()}
            onChange={e => e.target.value && setSelectedDate(e.target.value)}
            style={{
              ...inputStyle,
              width: isMobile ? "100%" : "auto",
              flex: isMobile ? 1 : undefined,
              minHeight: "36px",
              padding: "6px 10px",
            }}
          />
          <button
            onClick={() => setSelectedDate(d => navigateDate(d, 1))}
            disabled={isToday}
            style={{
              ...btnGhost,
              padding: "7px 14px",
              minHeight: "36px",
              fontSize: "18px",
              opacity: isToday ? 0.35 : 1,
            }}
            title="Next day"
          >
            ›
          </button>
          {!isToday && (
            <button
              onClick={() => setSelectedDate(todayStr())}
              style={{ ...btnGhost, minHeight: "36px", padding: "6px 14px", fontSize: "13px" }}
            >
              Today
            </button>
          )}
          {dateLoading && (
            <span style={{ fontSize: "13px", color: t.textSecondary }}>Loading...</span>
          )}
        </div>
        {!isToday && (
          <p style={{ color: t.textSecondary, fontSize: "13px", marginTop: "6px" }}>
            {formatDisplayDate(selectedDate)}
          </p>
        )}
      </div>

      {/* Start session form */}
      {!session && !dateLoading && (
        <div style={card}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: t.textPrimary }}>
            {isToday ? "Start today's session" : "Log a session for this date"}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "13px", color: t.textSecondary }}>Focus</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {focusOptions.map(f => (
                <button
                  key={f}
                  onClick={() => setFocus(f)}
                  style={{
                    flex: isMobile ? 1 : undefined,
                    padding: "9px 20px",
                    borderRadius: "8px",
                    border: focus === f ? "1px solid #534AB7" : `1px solid ${t.inputBorder}`,
                    background: focus === f ? "#EEEDFE" : t.btnGhostBg,
                    color: focus === f ? "#3C3489" : t.btnGhostColor,
                    fontWeight: focus === f ? "500" : "400",
                    fontSize: "14px",
                    cursor: "pointer",
                    minHeight: "44px",
                  }}
                >
                  {f} body
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "13px", color: t.textSecondary }}>
              Energy level: {energyLevel}/5
            </label>
            <input
              type="range" min="1" max="5" step="1"
              value={energyLevel}
              onChange={e => setEnergyLevel(parseInt(e.target.value))}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "13px", color: t.textSecondary }}>
              Planned duration (mins)
            </label>
            <input
              type="number"
              placeholder="e.g. 60"
              value={durationMins}
              onChange={e => setDurationMins(e.target.value)}
              style={{ ...inputStyle, width: isMobile ? "100%" : "140px" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "13px", color: t.textSecondary }}>Notes</label>
            <textarea
              placeholder="Any notes..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div>
            <button
              onClick={handleCreateSession}
              disabled={creating}
              style={{ ...btnPrimary, width: isMobile ? "100%" : undefined }}
            >
              {creating ? "Starting..." : "Start session"}
            </button>
          </div>
        </div>
      )}

      {/* Active session */}
      {session && (
        <>
          {/* Session header */}
          <div style={{
            background: "#EEEDFE",
            borderRadius: "12px",
            border: "1px solid #534AB7",
            padding: isMobile ? "14px 16px" : "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "600", color: "#3C3489" }}>
                {session.focus} body session
              </div>
              <div style={{ fontSize: "13px", color: "#534AB7", marginTop: "2px" }}>
                Energy: {session.energy_level}/5
                {session.duration_mins > 0 && ` · ${session.duration_mins} mins planned`}
              </div>
            </div>
            <div style={{
              fontSize: "13px",
              color: "#534AB7",
              background: "#fff",
              padding: "4px 14px",
              borderRadius: "20px",
              border: "1px solid #534AB7",
              fontWeight: "500",
              flexShrink: 0,
            }}>
              {isToday ? "Active" : "Logged"}
            </div>
          </div>

          {/* Add exercise */}
          <div style={card}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: t.textPrimary }}>
              Add exercise
            </h2>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {phases.map(phase => {
                const c = phaseColors[phase]
                const isActive = activePhase === phase
                return (
                  <button
                    key={phase}
                    onClick={() => setActivePhase(phase)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "20px",
                      border: `1px solid ${isActive ? c.border : t.inputBorder}`,
                      background: isActive ? c.bg : t.btnGhostBg,
                      color: isActive ? c.color : t.textSecondary,
                      fontSize: "13px",
                      fontWeight: isActive ? "500" : "400",
                      cursor: "pointer",
                      minHeight: "36px",
                    }}
                  >
                    {phase}
                  </button>
                )
              })}
            </div>

            <div style={{ display: "flex", gap: "8px", flexDirection: isMobile ? "column" : "row" }}>
              <select
                value={selectedExercise}
                onChange={e => setSelectedExercise(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
              >
                <option value="">Select an exercise...</option>
                {filteredExercises.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.muscle_group})
                  </option>
                ))}
              </select>
              <button onClick={handleAddExercise} style={btnSecondary}>
                Add exercise
              </button>
            </div>
          </div>

          {/* Exercises by phase */}
          {phases.map(phase => {
            const exs = sessionExercisesByPhase[phase]
            if (exs.length === 0) return null
            const c = phaseColors[phase]
            return (
              <div key={phase} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h2 style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: c.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}>
                  {phase}
                </h2>

                {exs.map(se => {
                  const inp = setInputs[se.id] || {}
                  const setCount = se.sets?.length || 0
                  return (
                    <div key={se.id} style={{
                      background: t.cardBg,
                      borderRadius: "12px",
                      border: `1px solid ${t.cardBorder}`,
                      padding: cardPad,
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}>
                      <div style={{ fontSize: "15px", fontWeight: "600", color: t.textPrimary }}>
                        {se.exercise?.name}
                      </div>

                      {/* Logged sets */}
                      {setCount > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {/* Header */}
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: "24px 1fr 1fr 1fr auto 24px",
                            gap: "6px",
                            fontSize: "11px",
                            fontWeight: "600",
                            color: t.textSecondary,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            padding: "0 2px",
                          }}>
                            <span>#</span>
                            <span>Reps</span>
                            <span>kg</span>
                            <span>Secs</span>
                            <span>RPE</span>
                            <span></span>
                          </div>

                          {se.sets.map((set, idx) => (
                            <div key={set.id} style={{
                              display: "grid",
                              gridTemplateColumns: "24px 1fr 1fr 1fr auto 24px",
                              gap: "6px",
                              fontSize: "14px",
                              padding: "8px 2px",
                              borderRadius: "6px",
                              background: t.rowBg,
                              alignItems: "center",
                              color: t.textPrimary,
                            }}>
                              <span style={{ color: t.textSecondary, fontSize: "12px" }}>{idx + 1}</span>
                              <span>{set.reps > 0 ? set.reps : "—"}</span>
                              <span>{set.weight_kg > 0 ? `${set.weight_kg}` : "—"}</span>
                              <span>{set.duration_secs > 0 ? `${set.duration_secs}s` : "—"}</span>
                              <span><RpeBadge rpe={set.rpe} /></span>
                              <button
                                onClick={() => handleDeleteSet(set.id, se.id)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: t.textSecondary,
                                  fontSize: "16px",
                                  cursor: "pointer",
                                  padding: "0",
                                  lineHeight: 1,
                                  minHeight: "unset",
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Set input form */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: t.textSecondary,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}>
                          Log Set {setCount + 1}
                        </div>

                        {isMobile ? (
                          // Mobile: 2×2 grid + full-width button
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                              <input
                                type="number"
                                placeholder="Reps"
                                value={inp.reps || ""}
                                onChange={e => updateSetInput(se.id, "reps", e.target.value)}
                                style={inputStyle}
                              />
                              <input
                                type="number"
                                placeholder="kg"
                                value={inp.weight_kg || ""}
                                onChange={e => updateSetInput(se.id, "weight_kg", e.target.value)}
                                style={inputStyle}
                              />
                              <input
                                type="number"
                                placeholder="Seconds"
                                value={inp.duration_secs || ""}
                                onChange={e => updateSetInput(se.id, "duration_secs", e.target.value)}
                                style={inputStyle}
                              />
                              <select
                                value={inp.rpe || ""}
                                onChange={e => updateSetInput(se.id, "rpe", e.target.value)}
                                style={inputStyle}
                              >
                                <option value="">RPE</option>
                                {RPE_OPTIONS.map(o => (
                                  <option key={o.value} value={o.value}>{o.value}</option>
                                ))}
                              </select>
                            </div>
                            <button
                              onClick={() => handleAddSet(se.id)}
                              style={{ ...btnSecondary, width: "100%" }}
                            >
                              + Log Set {setCount + 1}
                            </button>
                          </div>
                        ) : (
                          // Desktop: single row
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
                            gap: "8px",
                            alignItems: "center",
                          }}>
                            <input
                              type="number"
                              placeholder="Reps"
                              value={inp.reps || ""}
                              onChange={e => updateSetInput(se.id, "reps", e.target.value)}
                              style={inputStyle}
                            />
                            <input
                              type="number"
                              placeholder="kg"
                              value={inp.weight_kg || ""}
                              onChange={e => updateSetInput(se.id, "weight_kg", e.target.value)}
                              style={inputStyle}
                            />
                            <input
                              type="number"
                              placeholder="Seconds"
                              value={inp.duration_secs || ""}
                              onChange={e => updateSetInput(se.id, "duration_secs", e.target.value)}
                              style={inputStyle}
                            />
                            <select
                              value={inp.rpe || ""}
                              onChange={e => updateSetInput(se.id, "rpe", e.target.value)}
                              style={inputStyle}
                            >
                              <option value="">RPE (optional)</option>
                              {RPE_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.value}</option>
                              ))}
                            </select>
                            <button onClick={() => handleAddSet(se.id)} style={btnGhost}>
                              + Set
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

export default Today
