import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"
import Today from "./pages/Today"
import Recommend from "./pages/Recommend"
import Catalog from "./pages/Catalog"
import Progress from "./pages/Progress"
import "./index.css"

function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 16px" }}>
        <nav style={{
          display: "flex",
          gap: "24px",
          padding: "20px 0",
          borderBottom: "1px solid #eee",
          marginBottom: "32px",
        }}>
          <span style={{ fontWeight: "500", fontSize: "18px", marginRight: "16px" }}>
            GymFlow
          </span>
          {[
            { to: "/", label: "Today" },
            { to: "/recommend", label: "Recommend" },
            { to: "/catalog", label: "Catalog" },
            { to: "/progress", label: "Progress" },
          ].map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              style={({ isActive }) => ({
                textDecoration: "none",
                fontSize: "15px",
                color: isActive ? "#534AB7" : "#888",
                fontWeight: isActive ? "500" : "400",
                borderBottom: isActive ? "2px solid #534AB7" : "none",
                paddingBottom: "4px",
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App