import { useState, useEffect } from "react"
import { getExercises } from "../api"

const categoryOrder = ["Upper", "Lower", "Cardio", "Warmup", "Cooldown"]

const categoryColors = {
  Upper: { bg: "#EEEDFE", color: "#3C3489", border: "#534AB7" },
  Lower: { bg: "#E1F5EE", color: "#085041", border: "#0F6E56" },
  Cardio: { bg: "#FAEEDA", color: "#633806", border: "#854F0B" },
  Warmup: { bg: "#EAF3DE", color: "#27500A", border: "#3B6D11" },
  Cooldown: { bg: "#E6F1FB", color: "#0C447C", border: "#185FA5" },
}

function Catalog() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("Upper")
  const [search, setSearch] = useState("")

  useEffect(() => {
    getExercises().then(res => {
      setExercises(res.data)
      setLoading(false)
    })
  }, [])

  const filtered = exercises.filter(ex => {
    const matchesCategory = ex.category === activeCategory
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const grouped = filtered.reduce((acc, ex) => {
    if (!acc[ex.muscle_group]) acc[ex.muscle_group] = []
    acc[ex.muscle_group].push(ex)
    return acc
  }, {})

  if (loading) return <p style={{ color: "#888" }}>Loading catalog...</p>

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: "500", marginBottom: "4px" }}>
          Exercise catalog
        </h1>
        <p style={{ color: "#888", fontSize: "14px" }}>
          {exercises.length} exercises across all categories
        </p>
      </div>

      <input
        type="text"
        placeholder="Search exercises..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          fontSize: "15px",
          width: "100%",
          background: "#fff",
        }}
      />

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {categoryOrder.map(cat => {
          const c = categoryColors[cat]
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "6px 16px",
                borderRadius: "20px",
                border: `1px solid ${isActive ? c.border : "#ddd"}`,
                background: isActive ? c.bg : "#fff",
                color: isActive ? c.color : "#888",
                fontSize: "14px",
                fontWeight: isActive ? "500" : "400",
                transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {Object.keys(grouped).length === 0 && (
        <p style={{ color: "#888" }}>No exercises found.</p>
      )}

      {Object.entries(grouped).map(([muscleGroup, exs]) => (
        <div key={muscleGroup}>
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <span>{ex.name}</span>
                <span style={{
                  fontSize: "12px",
                  color: categoryColors[ex.category]?.color || "#888",
                  background: categoryColors[ex.category]?.bg || "#f5f5f5",
                  padding: "2px 10px",
                  borderRadius: "12px",
                }}>
                  {ex.muscle_group}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Catalog