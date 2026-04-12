import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"
import Today from "./pages/Today"
import Recommend from "./pages/Recommend"
import Catalog from "./pages/Catalog"
import Progress from "./pages/Progress"
import "./index.css"

const navLinks = [
  { to: "/", label: "Today" },
  { to: "/recommend", label: "Recommend" },
  { to: "/catalog", label: "Catalog" },
  { to: "/progress", label: "Progress" },
]

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("gymflow-dark") === "true"
  )

  useEffect(() => {
    document.body.style.background = darkMode ? "#0f172a" : "#fafafa"
    document.body.style.color = darkMode ? "#f1f5f9" : "#1a1a1a"
    localStorage.setItem("gymflow-dark", String(darkMode))
  }, [darkMode])

  const navBorder = darkMode ? "#334155" : "#eee"
  const toggleBg = darkMode ? "#1e293b" : "#fff"
  const toggleBorder = darkMode ? "#334155" : "#ddd"
  const toggleColor = darkMode ? "#94a3b8" : "#555"

  return (
    <BrowserRouter>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 16px" }}>
        <nav style={{
          display: "flex",
          alignItems: "center",
          padding: "20px 0",
          borderBottom: `1px solid ${navBorder}`,
          marginBottom: "32px",
        }}>
          <span style={{
            fontWeight: "700",
            fontSize: "18px",
            color: "#534AB7",
            flexShrink: 0,
            letterSpacing: "-0.3px",
          }}>
            GymFlow
          </span>

          <div style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            gap: "8px",
          }}>
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                style={({ isActive }) => ({
                  textDecoration: "none",
                  fontSize: "15px",
                  color: isActive ? "#534AB7" : (darkMode ? "#94a3b8" : "#888"),
                  fontWeight: isActive ? "600" : "400",
                  borderBottom: isActive ? "2px solid #534AB7" : "2px solid transparent",
                  paddingBottom: "4px",
                  padding: "4px 12px",
                  borderRadius: "6px",
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <button
            onClick={() => setDarkMode(d => !d)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              flexShrink: 0,
              padding: "7px 14px",
              borderRadius: "8px",
              border: `1px solid ${toggleBorder}`,
              background: toggleBg,
              color: toggleColor,
              fontSize: "14px",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s, border-color 0.2s",
            }}
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </nav>

        <Routes>
          <Route path="/" element={<Today darkMode={darkMode} />} />
          <Route path="/recommend" element={<Recommend darkMode={darkMode} />} />
          <Route path="/catalog" element={<Catalog darkMode={darkMode} />} />
          <Route path="/progress" element={<Progress darkMode={darkMode} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
