import { useState, useEffect } from "react"
import { getSessions, deleteSession } from "../api"

const focusColors = {
  Upper:  { bg: "#EEEDFE", color: "#3C3489" },
  Lower:  { bg: "#E1F5EE", color: "#085041" },
  Cardio: { bg: "#FAEEDA", color: "#633806" },
}

function getTheme(darkMode) {
  return {
    cardBg:        darkMode ? "#1e293b" : "#fff",
    cardBorder:    darkMode ? "#334155" : "#eee",
    textPrimary:   darkMode ? "#f1f5f9" : "#1a1a1a",
    textSecondary: darkMode ? "#94a3b8" : "#888",
    tagBg:         darkMode ? "#334155" : "#f5f5f5",
    tagColor:      darkMode ? "#cbd5e1" : "#555",
  }
}

function Progress({ darkMode }) {
  const t = getTheme(darkMode)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadSessions() }, [])

  function loadSessions() {
    getSessions().then(res => {
      setSessions(res.data)
      setLoading(false)
    })
  }

  function handleDelete(id) {
    if (!confirm("Delete this session?")) return
    deleteSession(id).then(loadSessions)
  }

  if (loading) return <p style={{ color: t.textSecondary }}>Loading sessions...</p>

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "4px", color: t.textPrimary }}>
          Progress
        </h1>
        <p style={{ color: t.textSecondary, fontSize: "14px" }}>
          {sessions.length} sessions logged
        </p>
      </div>

      {sessions.length === 0 && (
        <div style={{
          padding: "40px",
          textAlign: "center",
          color: t.textSecondary,
          background: t.cardBg,
          borderRadius: "12px",
          border: `1px solid ${t.cardBorder}`,
        }}>
          No sessions yet — log your first workout on the Today page.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {sessions.map(session => {
          const colors = focusColors[session.focus] || focusColors.Upper
          const exerciseCount = session.session_exercises?.length || 0
          const setCount = session.session_exercises?.reduce(
            (acc, se) => acc + (se.sets?.length || 0), 0
          ) || 0

          return (
            <div key={session.id} style={{
              background: t.cardBg,
              borderRadius: "12px",
              border: `1px solid ${t.cardBorder}`,
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    background: colors.bg,
                    color: colors.color,
                    fontSize: "13px",
                    fontWeight: "500",
                  }}>
                    {session.focus}
                  </span>
                  <span style={{ fontSize: "15px", fontWeight: "600", color: t.textPrimary }}>
                    {session.date}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(session.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: t.textSecondary,
                    fontSize: "18px",
                    cursor: "pointer",
                    padding: "0 4px",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: t.textSecondary }}>
                <span>{exerciseCount} exercises</span>
                <span>{setCount} sets</span>
                {session.duration_mins > 0 && <span>{session.duration_mins} mins</span>}
                {session.energy_level && <span>Energy: {session.energy_level}/5</span>}
              </div>

              {session.session_exercises?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {session.session_exercises.map(se => (
                    <span key={se.id} style={{
                      fontSize: "12px",
                      padding: "2px 10px",
                      borderRadius: "20px",
                      background: t.tagBg,
                      color: t.tagColor,
                    }}>
                      {se.exercise?.name}
                    </span>
                  ))}
                </div>
              )}

              {session.notes && (
                <p style={{ fontSize: "13px", color: t.textSecondary, fontStyle: "italic" }}>
                  {session.notes}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Progress
