import { useState, useEffect } from "react"
import { getExercises, createExercise, updateExercise, deleteExercise } from "../api"

const categoryOrder = ["Upper", "Lower", "Cardio", "Warmup", "Cooldown"]

const categoryColors = {
  Upper:    { bg: "#EEEDFE", color: "#3C3489", border: "#534AB7" },
  Lower:    { bg: "#E1F5EE", color: "#085041", border: "#0F6E56" },
  Cardio:   { bg: "#FAEEDA", color: "#633806", border: "#854F0B" },
  Warmup:   { bg: "#EAF3DE", color: "#27500A", border: "#3B6D11" },
  Cooldown: { bg: "#E6F1FB", color: "#0C447C", border: "#185FA5" },
}

const MUSCLE_GROUPS = {
  Upper:    ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Core"],
  Lower:    ["Quads", "Hamstrings", "Glutes", "Calves", "Adductors"],
  Cardio:   ["Full body"],
  Warmup:   ["Full body", "Shoulders", "Hips"],
  Cooldown: ["Full body"],
}

const emptyForm = { name: "", category: "Upper", muscle_group: "Chest", session_type: "Main", description: "" }

function getTheme(darkMode) {
  return {
    cardBg:         darkMode ? "#1e293b" : "#fff",
    cardBorder:     darkMode ? "#334155" : "#eee",
    inputBg:        darkMode ? "#0f172a" : "#fff",
    inputBorder:    darkMode ? "#334155" : "#ddd",
    textPrimary:    darkMode ? "#f1f5f9" : "#1a1a1a",
    textSecondary:  darkMode ? "#94a3b8" : "#888",
    btnGhostBg:     darkMode ? "#1e293b" : "#fff",
    btnGhostBorder: darkMode ? "#334155" : "#ddd",
    btnGhostColor:  darkMode ? "#cbd5e1" : "#555",
    tagBg:          darkMode ? "#334155" : "#f5f5f5",
    tagColor:       darkMode ? "#cbd5e1" : "#555",
  }
}

export default function Catalog({ darkMode, isMobile }) {
  const t = getTheme(darkMode)

  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("Upper")
  const [search, setSearch] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const res = await getExercises()
    setExercises(res.data)
    setLoading(false)
  }

  const filtered = exercises.filter(ex =>
    ex.category === activeCategory &&
    ex.name.toLowerCase().includes(search.toLowerCase())
  )

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

  if (loading) return <p style={{ color: t.textSecondary }}>Loading catalog...</p>

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
    padding: "9px 18px",
    borderRadius: "8px",
    border: "1px solid #534AB7",
    background: "#534AB7",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    minHeight: "44px",
    whiteSpace: "nowrap",
  }

  const btnSecondary = {
    padding: "9px 18px",
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
    padding: "9px 18px",
    borderRadius: "8px",
    border: `1px solid ${t.btnGhostBorder}`,
    background: t.btnGhostBg,
    color: t.btnGhostColor,
    fontSize: "14px",
    cursor: "pointer",
    minHeight: "44px",
    whiteSpace: "nowrap",
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header row */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "center",
        gap: "12px",
        flexWrap: isMobile ? "wrap" : "nowrap",
      }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "4px", color: t.textPrimary }}>
            Exercise catalog
          </h1>
          <p style={{ color: t.textSecondary, fontSize: "14px" }}>
            {exercises.length} exercises across all categories
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
          <button
            onClick={() => setEditMode(!editMode)}
            style={editMode ? btnSecondary : btnGhost}
          >
            {editMode ? "Done" : "Edit catalog"}
          </button>
          {editMode && (
            <button onClick={startAdd} style={btnPrimary}>
              + Add
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search exercises..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={inputStyle}
      />

      {/* Category filter pills — flex-wrap handles mobile */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {categoryOrder.map(cat => {
          const cc = categoryColors[cat]
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "7px 16px",
                borderRadius: "20px",
                border: isActive ? `1px solid ${cc.border}` : `1px solid ${t.inputBorder}`,
                background: isActive ? cc.bg : t.btnGhostBg,
                color: isActive ? cc.color : t.textSecondary,
                fontSize: "14px",
                fontWeight: isActive ? "500" : "400",
                cursor: "pointer",
                minHeight: "36px",
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div style={{
          background: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          borderRadius: "12px",
          padding: cardPad,
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}>
          <h3 style={{ fontSize: "16px", fontWeight: "600", margin: 0, color: t.textPrimary }}>
            {editingId ? "Edit exercise" : "Add new exercise"}
          </h3>

          {/* 2-col on desktop, 1-col on mobile */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "12px",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "13px", color: t.textSecondary }}>Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Exercise name"
                style={inputStyle}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "13px", color: t.textSecondary }}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value, muscle_group: MUSCLE_GROUPS[e.target.value][0] })}
                style={inputStyle}
              >
                {categoryOrder.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "13px", color: t.textSecondary }}>Muscle group</label>
              <select
                value={form.muscle_group}
                onChange={e => setForm({ ...form, muscle_group: e.target.value })}
                style={inputStyle}
              >
                {(MUSCLE_GROUPS[form.category] || []).map(mg => <option key={mg} value={mg}>{mg}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "13px", color: t.textSecondary }}>Session type</label>
              <select
                value={form.session_type}
                onChange={e => setForm({ ...form, session_type: e.target.value })}
                style={inputStyle}
              >
                {["Main", "Warmup", "Cardio", "Cooldown"].map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button
              onClick={() => { setShowForm(false); setEditingId(null) }}
              style={btnGhost}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.name}
              style={btnPrimary}
            >
              {saving ? "Saving..." : editingId ? "Save changes" : "Add exercise"}
            </button>
          </div>
        </div>
      )}

      {Object.keys(grouped).length === 0 && (
        <p style={{ color: t.textSecondary }}>No exercises found.</p>
      )}

      {Object.entries(grouped).map(([muscleGroup, exs]) => (
        <div key={muscleGroup}>
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
                padding: isMobile ? "12px" : "12px 16px",
                borderRadius: "8px",
                border: `1px solid ${t.cardBorder}`,
                background: t.cardBg,
                fontSize: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
                color: t.textPrimary,
              }}>
                <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ex.name}
                </span>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
                  {!isMobile && (
                    <span style={{
                      fontSize: "12px",
                      color: categoryColors[ex.category]?.color || t.textSecondary,
                      background: categoryColors[ex.category]?.bg || t.tagBg,
                      padding: "2px 10px",
                      borderRadius: "12px",
                      fontWeight: "500",
                      whiteSpace: "nowrap",
                    }}>
                      {ex.muscle_group}
                    </span>
                  )}
                  {editMode && (
                    <>
                      <button
                        onClick={() => startEdit(ex)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: `1px solid ${t.btnGhostBorder}`,
                          background: t.btnGhostBg,
                          fontSize: "13px",
                          cursor: "pointer",
                          color: t.btnGhostColor,
                          minHeight: "36px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ex.id)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid #fca5a5",
                          background: "#fef2f2",
                          fontSize: "13px",
                          cursor: "pointer",
                          color: "#dc2626",
                          minHeight: "36px",
                          whiteSpace: "nowrap",
                        }}
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
