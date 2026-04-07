import { useState, useEffect } from "react"
import { getRecommendation } from "../api"

const focusColors = {
  Upper: { bg: "#EEEDFE", color: "#3C3489", border: "#534AB7" },
  Lower: { bg: "#E1F5EE", color: "#085041", border: "#0F6E56" },
}

function Recommend() {
  const [rec, setRec] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRecommendation().then(res => {
      setRec(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <p style={{ color: "#888" }}>Loading recommendation...</p>

  const colors = focusColors[rec.recommended_focus] || focusColors.Upper

  const grouped = rec.suggested_exercises.reduce((acc, ex) => {
    if (!acc[ex.muscle_group]) acc[ex.muscle_group] = []
    acc[ex.muscle_group].push(ex)
    return acc
  }, {})

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: "500", marginBottom: "4px" }}>
          What to do today
        </h1>
        <p style={{ color: "#888", fontSize: "14px" }}>
          Based on your recent sessions
        </p>
      </div>

      <div style={{
        padding: "20px",
        borderRadius: "12px",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
        <div style={{
          fontSize: "28px",
          fontWeight: "500",
          color: colors.color,
        }}>
          {rec.recommended_focus} body
        </div>
        <div style={{ fontSize: "14px", color: colors.color, opacity: 0.8 }}>
          {rec.reason}
        </div>
      </div>

      <div>
        <h2 style={{
          fontSize: "16px",
          fontWeight: "500",
          marginBottom: "16px",
          color: "#333",
        }}>
          Suggested exercises
        </h2>

        {Object.entries(grouped).map(([muscleGroup, exs]) => (
          <div key={muscleGroup} style={{ marginBottom: "20px" }}>
            <h3 style={{
              fontSize: "13px",
              fontWeight: "500",
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "10px",
            }}>
              {muscleGroup}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {exs.map(ex => (
                <div key={ex.id} style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #eee",
                  background: "#fff",
                  fontSize: "15px",
                }}>
                  {ex.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Recommend