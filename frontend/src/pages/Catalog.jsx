import { useState, useEffect } from "react"
import { getExercises, createExercise, updateExercise, deleteExercise } from "../api"

const categoryOrder = ["Upper", "Lower", "Cardio", "Warmup", "Cooldown"]

const categoryColors = {
  Upper: { bg: "#EEEDFE", color: "#3C3489", border: "#534AB7" },
  Lower: { bg: "#E1F5EE", color: "#085041", border: "#0F6E56" },
  Cardio: { bg: "#FAEEDA", color: "#633806", border: "#854F0B" },
  Warmup: { bg: "#EAF3DE", color: "#27500A", border: "#3B6D11" },
  Cooldown: { bg: "#E6F1FB", color: "#0C447C", border: "#185FA5" },
}

const MUSCLE_GROUPS = {
  Upper: ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Core"],
  Lower: ["Quads", "Hamstrings", "Glutes", "Calves", "Adductors"],
  Cardio: ["Full body"],
  Warmup: ["Full body", "Shoulders", "Hips"],
  Cooldown: ["Full body"],
}

const emptyForm = { name: "", category: "Upper", muscle_group: "Chest", session_type: "Main", description: "" }

export default function Catalog() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("Upper")
  const [search, setSearch] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const res = await getExercises()
    setExercises(res.data)
    setLoading(false)
  }

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

  function startEdit(ex) {
    setForm({
      name: ex.name,
      category: ex.category,
      muscle_group: ex.muscle_group,
      session_type: ex.session_type,
      description: ex.description || "",
    })
    setEditingId(ex.id)
    setShowForm(true)
  }

  function startAdd() {
    setForm({ ...emptyForm, category: activeCategory, muscle_group: MUSCLE_GROUPS[activeCategory][0] })
    setEditingId(null)
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    if (editingId) {
      await updateExercise(editingId, form)
    } else {
      await createExercise(form)
    }
    await load()
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm("Delete this exercise?")) return
    await deleteExercise(id)
    setExercises(prev => prev.filter(e => e.id !== id))
  }

  if (loading) return <p style={{ padding: "32px", color: "#888" }}>Loading catalog...</p>

  const c = categoryColors[activeCategory] || categoryColors.Upper

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "500", marginBottom: "4px" }}>
            Exercise catalog
          </h1>
          <p style={{ color: "#888", fontSize: "14px" }}>
            {exercises.length} exercises across all categories
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setEditMode(!editMode)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: editMode ? "1px solid #534AB7" : "1px solid #ddd",
              background: editMode ? "#EEEDFE" : "#fff",
              color: editMode ? "#3C3489" : "#555",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            {editMode ? "Done editing" : "Edit catalog"}
          </button>
          {editMode && (
            <button
              onClick={startAdd}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #534AB7",
                background: "#534AB7",
                color: "#fff",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              + Add exercise
            </button>
          )}
        </div>
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
          const cc = categoryColors[cat]
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "6px 16px",
                borderRadius: "20px",
                border: isActive ? "1px solid " + cc.border : "1px solid #ddd",
                background: isActive ? cc.bg : "#fff",
                color: isActive ? cc.color : "#888",
                fontSize: "14px",
                fontWeight: isActive ? "500" : "400",
                cursor: "pointer",
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {showForm && (
        <div style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: "500", margin: 0 }}>
            {editingId ? "Edit exercise" : "Add new exercise"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "13px", color: "#888" }}>Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Exercise name"
                style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "13px", color: "#888" }}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value, muscle_group: MUSCLE_GROUPS[e.target.value][0] })}
                style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
              >
                {categoryOrder.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "13px", color: "#888" }}>Muscle group</label>
              <select
                value={form.muscle_group}
                onChange={e => setForm({ ...form, muscle_group: e.target.value })}
                style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
              >
                {(MUSCLE_GROUPS[form.category] || []).map(mg => <option key={mg} value={mg}>{mg}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "13px", color: "#888" }}>Session type</label>
              <select
                value={form.session_type}
                onChange={e => setForm({ ...form, session_type: e.target.value })}
                style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
              >
                {["Main", "Warmup", "Cardio", "Cooldown"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button
              onClick={() => { setShowForm(false); setEditingId(null) }}
              style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", fontSize: "14px", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.name}
              style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #534AB7", background: "#534AB7", color: "#fff", fontSize: "14px", cursor: "pointer" }}
            >
              {saving ? "Saving..." : editingId ? "Save changes" : "Add exercise"}
            </button>
          </div>
        </div>
      )}

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
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{
                    fontSize: "12px",
                    color: categoryColors[ex.category]?.color || "#888",
                    background: categoryColors[ex.category]?.bg || "#f5f5f5",
                    padding: "2px 10px",
                    borderRadius: "12px",
                  }}>
                    {ex.muscle_group}
                  </span>
                  {editMode && (
                    <>
                      <button
                        onClick={() => startEdit(ex)}
                        style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #ddd", background: "#fff", fontSize: "12px", cursor: "pointer", color: "#555" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ex.id)}
                        style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid #fca5a5", background: "#fef2f2", fontSize: "12px", cursor: "pointer", color: "#dc2626" }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
