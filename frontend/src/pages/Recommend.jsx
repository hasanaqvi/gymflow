import { useState, useEffect } from "react"
import { getRecommendation } from "../api"

const focusColors = {
  Upper: { bg: "#EEEDFE", color: "#3C3489", border: "#534AB7" },
  Lower: { bg: "#E1F5EE", color: "#085041", border: "#0F6E56" },
}

function getTheme(darkMode) {
  return {
    cardBg:        darkMode ? "#1e293b" : "#fff",
    cardBorder:    darkMode ? "#334155" : "#eee",
    textPrimary:   darkMode ? "#f1f5f9" : "#1a1a1a",
    textSecondary: darkMode ? "#94a3b8" : "#888",
    headingColor:  darkMode ? "#e2e8f0" : "#333",
  }
}

function Recommend({ darkMode, isMobile }) {
  const t = getTheme(darkMode)
  const [rec, setRec] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRecommendation().then(res => {
      setRec(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <p style={{ color: t.textSecondary }}>Loading recommendation...</p>

  const colors = focusColors[rec.recommended_focus] || focusColors.Upper

  const grouped = rec.suggested_exercises.reduce((acc, ex) => {
    if (!acc[ex.muscle_group]) acc[ex.muscle_group] = []
    acc[ex.muscle_group].push(ex)
    return acc
  }, {})

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "4px", color: t.textPrimary }}>
          What to do today
        </h1>
        <p style={{ color: t.textSecondary, fontSize: "14px" }}>
          Based on your recent sessions
        </p>
      </div>

      <div style={{
        padding: isMobile ? "16px" : "20px 24px",
        borderRadius: "12px",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
        <div style={{ fontSize: isMobile ? "24px" : "28px", fontWeight: "600", color: colors.color }}>
          {rec.recommended_focus} body
        </div>
        <div style={{ fontSize: "14px", color: colors.color, opacity: 0.8 }}>
          {rec.reason}
        </div>
      </div>

      <div>
        <h2 style={{
          fontSize: "16px",
          fontWeight: "600",
          marginBottom: "16px",
          color: t.headingColor,
        }}>
          Suggested exercises
        </h2>

        {Object.entries(grouped).map(([muscleGroup, exs]) => (
          <div key={muscleGroup} style={{ marginBottom: "20px" }}>
            <h3 style={{
              fontSize: "12px",
              fontWeight: "600",
              color: t.textSecondary,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "10px",
            }}>
              {muscleGroup}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {exs.map(ex => (
                <div key={ex.id} style={{
                  padding: isMobile ? "14px" : "12px 16px",
                  borderRadius: "8px",
                  border: `1px solid ${t.cardBorder}`,
                  background: t.cardBg,
                  fontSize: "15px",
                  color: t.textPrimary,
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
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
