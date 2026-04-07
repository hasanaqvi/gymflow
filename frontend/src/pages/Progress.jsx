import { useState, useEffect } from "react"
import { getSessions, deleteSession } from "../api"

const focusColors = {
  Upper: { bg: "#EEEDFE", color: "#3C3489" },
  Lower: { bg: "#E1F5EE", color: "#085041" },
  Cardio: { bg: "#FAEEDA", color: "#633806" },
}

function Progress() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSessions()
  }, [])

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

  if (loading) return <p style={{ color: "#888" }}>Loading sessions...</p>

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: "500", marginBottom: "4px" }}>
          Progress
        </h1>
        <p style={{ color: "#888", fontSize: "14px" }}>
          {sessions.length} sessions logged
        </p>
      </div>

      {sessions.length === 0 && (
        <div style={{
          padding: "40px",
          textAlign: "center",
          color: "#888",
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #eee",
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
              background: "#fff",
              borderRadius: "12px",
              border: "1px solid #eee",
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
                    borderRadius: "12px",
                    background: colors.bg,
                    color: colors.color,
                    fontSize: "13px",
                    fontWeight: "500",
                  }}>
                    {session.focus}
                  </span>
                  <span style={{ fontSize: "15px", fontWeight: "500" }}>
                    {session.date}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(session.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ccc",
                    fontSize: "18px",
                    cursor: "pointer",
                    padding: "0 4px",
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{
                display: "flex",
                gap: "20px",
                fontSize: "13px",
                color: "#888",
              }}>
                <span>{exerciseCount} exercises</span>
                <span>{setCount} sets</span>
                {session.duration_mins > 0 && (
                  <span>{session.duration_mins} mins</span>
                )}
                {session.energy_level && (
                  <span>Energy: {session.energy_level}/5</span>
                )}
              </div>

              {session.session_exercises?.length > 0 && (
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                }}>
                  {session.session_exercises.map(se => (
                    <span key={se.id} style={{
                      fontSize: "12px",
                      padding: "2px 10px",
                      borderRadius: "12px",
                      background: "#f5f5f5",
                      color: "#555",
                    }}>
                      {se.exercise?.name}
                    </span>
                  ))}
                </div>
              )}

              {session.notes && (
                <p style={{ fontSize: "13px", color: "#888", fontStyle: "italic" }}>
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