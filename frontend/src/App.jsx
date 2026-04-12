import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"
import Today from "./pages/Today"
import Recommend from "./pages/Recommend"
import Catalog from "./pages/Catalog"
import Progress from "./pages/Progress"
import "./index.css"

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  )
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])
  return width
}

const navLinks = [
  {
    to: "/",
    label: "Today",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
      </svg>
    ),
  },
  {
    to: "/recommend",
    label: "Recommend",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ),
  },
  {
    to: "/catalog",
    label: "Catalog",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
      </svg>
    ),
  },
  {
    to: "/progress",
    label: "Progress",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" />
      </svg>
    ),
  },
]

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("gymflow-dark") === "true"
  )
  const windowWidth = useWindowWidth()
  const isMobile = windowWidth < 768

  useEffect(() => {
    document.body.style.background = darkMode ? "#0f172a" : "#fafafa"
    document.body.style.color = darkMode ? "#f1f5f9" : "#1a1a1a"
    localStorage.setItem("gymflow-dark", String(darkMode))
  }, [darkMode])

  const navBorder  = darkMode ? "#334155" : "#eee"
  const toggleBg   = darkMode ? "#1e293b" : "#fff"
  const toggleBorder = darkMode ? "#334155" : "#ddd"
  const toggleColor  = darkMode ? "#94a3b8" : "#555"

  const pageProps = { darkMode, isMobile }

  return (
    <BrowserRouter>
      {/* Main content wrapper */}
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: isMobile ? "0 12px" : "0 16px",
        paddingBottom: isMobile ? "calc(64px + env(safe-area-inset-bottom, 0px))" : 0,
      }}>

        {/* Desktop nav */}
        {!isMobile && (
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

            <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: "8px" }}>
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
                    padding: "4px 12px",
                    paddingBottom: "4px",
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
              }}
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </nav>
        )}

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 0",
            borderBottom: `1px solid ${navBorder}`,
            marginBottom: "20px",
          }}>
            <span style={{ fontWeight: "700", fontSize: "18px", color: "#534AB7", letterSpacing: "-0.3px" }}>
              GymFlow
            </span>
            <button
              onClick={() => setDarkMode(d => !d)}
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                border: `1px solid ${toggleBorder}`,
                background: toggleBg,
                color: toggleColor,
                fontSize: "14px",
                cursor: "pointer",
                minHeight: "44px",
              }}
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Today {...pageProps} />} />
          <Route path="/recommend" element={<Recommend {...pageProps} />} />
          <Route path="/catalog" element={<Catalog {...pageProps} />} />
          <Route path="/progress" element={<Progress {...pageProps} />} />
        </Routes>
      </div>

      {/* Mobile bottom tab bar */}
      {isMobile && (
        <nav style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: darkMode ? "#1e293b" : "#fff",
          borderTop: `1px solid ${navBorder}`,
          display: "flex",
          zIndex: 100,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}>
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              style={({ isActive }) => ({
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                padding: "10px 0",
                minHeight: "56px",
                textDecoration: "none",
                color: isActive ? "#534AB7" : (darkMode ? "#64748b" : "#b0b8c8"),
                fontSize: "10px",
                fontWeight: isActive ? "600" : "400",
                letterSpacing: "0.01em",
              })}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </BrowserRouter>
  )
}

export default App
