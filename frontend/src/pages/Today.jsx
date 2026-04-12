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

function getTheme(darkMode) {
  return {
    cardBg:       darkMode ? "#1e293b" : "#fff",
    cardBorder:   darkMode ? "#334155" : "#eee",
    inputBg:      darkMode ? "#0f172a" : "#fff",
    inputBorder:  darkMode ? "#334155" : "#ddd",
    textPrimary:  darkMode ? "#f1f5f9" : "#1a1a1a",
    textSecondary: darkMode ? "#94a3b8" : "#888",
    rowBg:        darkMode ? "#0f172a" : "#fafafa",
    btnGhostBg:   darkMode ? "#1e293b" : "#fff",
    btnGhostBorder: darkMode ? "#334155" : "#ddd",
    btnGhostColor:  darkMode ? "#cbd5e1" : "#333",
  }
}

function Today({ darkMode }) {
  const t = getTheme(darkMode)

  const [exercises, setExercises] = useState([])
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const [focus, setFocus] = useState("Upper")
  const [energyLevel, setEnergyLevel] = useState(3)
  const [notes, setNotes] = useState("")
  const [durationMins, setDurationMins] = useState("")

  const [activePhase, setActivePhase] = useState("Main")
  const [selectedExercise, setSelectedExercise] = useState("")

  const [setInputs, setSetInputs] = useState({})

  useEffect(() => {
    Promise.all([getExercises(), getSessions()]).then(([exRes, seRes]) => {
      setExercises(exRes.data)
      const today = new Date().toISOString().split("T")[0]
      const todaySession = seRes.data.find(s => s.date === today)
      if (todaySession) setSession(todaySession)
      setLoading(false)
    })
  }, [])

  async function handleCreateSession() {
    setCreating(true)
    const today = new Date().toISOString().split("T")[0]
    const res = await createSession({
      date: today,
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
      duration_seconds: parseInt(input.duration_seconds) || 0,
      notes: input.notes || "",
    })
    const seRes = await getSessions()
    const today = new Date().toISOString().split("T")[0]
    const updated = seRes.data.find(s => s.date === today)
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
      [sessionExerciseId]: {
        ...(prev[sessionExerciseId] || {}),
        [field]: value,
      },
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
  }

  const btnGhost = {
    padding: "7px 14px",
    borderRadius: "8px",
    border: `1px solid ${t.btnGhostBorder}`,
    background: t.btnGhostBg,
    color: t.btnGhostColor,
    fontSize: "14px",
    cursor: "pointer",
  }

  const card = {
    background: t.cardBg,
    borderRadius: "12px",
    border: `1px solid ${t.cardBorder}`,
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "4px", color: t.textPrimary }}>
          Today
        </h1>
        <p style={{ color: t.textSecondary, fontSize: "14px" }}>
          {new Date().toLocaleDateString("en-DE", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>

      {!session && (
        <div style={card}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: t.textPrimary }}>
            Start a new session
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "13px", color: t.textSecondary }}>Focus</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {focusOptions.map(f => (
                <button
                  key={f}
                  onClick={() => setFocus(f)}
                  style={{
                    ...btnGhost,
                    border: focus === f ? "1px solid #534AB7" : `1px solid ${t.inputBorder}`,
                    background: focus === f ? "#EEEDFE" : t.btnGhostBg,
                    color: focus === f ? "#3C3489" : t.btnGhostColor,
                    fontWeight: focus === f ? "500" : "400",
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
              style={{ ...inputStyle, width: "140px" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontSize: "13px", color: t.textSecondary }}>Notes</label>
            <textarea
              placeholder="Any notes before you start..."
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
              style={btnPrimary}
            >
              {creating ? "Starting..." : "Start session"}
            </button>
          </div>
        </div>
      )}

      {session && (
        <>
          <div style={{
            background: "#EEEDFE",
            borderRadius: "12px",
            border: "1px solid #534AB7",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
            }}>
              Active
            </div>
          </div>

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
                      padding: "6px 16px",
                      borderRadius: "20px",
                      border: `1px solid ${isActive ? c.border : t.inputBorder}`,
                      background: isActive ? c.bg : t.btnGhostBg,
                      color: isActive ? c.color : t.textSecondary,
                      fontSize: "13px",
                      fontWeight: isActive ? "500" : "400",
                      cursor: "pointer",
                    }}
                  >
                    {phase}
                  </button>
                )
              })}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
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
                Add
              </button>
            </div>
          </div>

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

                {exs.map(se => (
                  <div key={se.id} style={{
                    background: t.cardBg,
                    borderRadius: "12px",
                    border: `1px solid ${t.cardBorder}`,
                    padding: "16px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}>
                    <div style={{ fontSize: "15px", fontWeight: "600", color: t.textPrimary }}>
                      {se.exercise?.name}
                    </div>

                    {se.sets?.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "32px 1fr 1fr 1fr 32px",
                          gap: "8px",
                          fontSize: "12px",
                          color: t.textSecondary,
                          padding: "0 4px",
                        }}>
                          <span>#</span>
                          <span>Reps</span>
                          <span>Weight (kg)</span>
                          <span>Duration (s)</span>
                          <span></span>
                        </div>
                        {se.sets.map((set, idx) => (
                          <div key={set.id} style={{
                            display: "grid",
                            gridTemplateColumns: "32px 1fr 1fr 1fr 32px",
                            gap: "8px",
                            fontSize: "14px",
                            padding: "6px 4px",
                            borderRadius: "6px",
                            background: t.rowBg,
                            alignItems: "center",
                            color: t.textPrimary,
                          }}>
                            <span style={{ color: t.textSecondary }}>{idx + 1}</span>
                            <span>{set.reps || "—"}</span>
                            <span>{set.weight_kg > 0 ? `${set.weight_kg}` : "—"}</span>
                            <span>{set.duration_seconds > 0 ? `${set.duration_seconds}s` : "—"}</span>
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
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr auto",
                      gap: "8px",
                      alignItems: "center",
                    }}>
                      <input
                        type="number"
                        placeholder="Reps"
                        value={setInputs[se.id]?.reps || ""}
                        onChange={e => updateSetInput(se.id, "reps", e.target.value)}
                        style={inputStyle}
                      />
                      <input
                        type="number"
                        placeholder="kg"
                        value={setInputs[se.id]?.weight_kg || ""}
                        onChange={e => updateSetInput(se.id, "weight_kg", e.target.value)}
                        style={inputStyle}
                      />
                      <input
                        type="number"
                        placeholder="Seconds"
                        value={setInputs[se.id]?.duration_seconds || ""}
                        onChange={e => updateSetInput(se.id, "duration_seconds", e.target.value)}
                        style={inputStyle}
                      />
                      <button onClick={() => handleAddSet(se.id)} style={btnGhost}>
                        + Set
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

export default Today
