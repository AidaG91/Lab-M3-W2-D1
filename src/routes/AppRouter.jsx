import { Routes, Route, Navigate, NavLink, Outlet } from "react-router-dom";
import Presentation from "../components/Presentation/Presentation";
import SongAnalytics from "../components/SongAnalytics/SongAnalytics";
import Song from "../components/Song/Song";
import HobbyList from "../components/HobbyList/HobbyList";
import ContactForm from "../components/ContactForm/ContactForm";

function Layout() {
  return (
    <>
      <header style={{ padding: "12px 16px", borderBottom: "1px solid #eee" }}>
        <nav style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <NavLink
            to="/home"
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "#f1a619" : "#111827",
              fontWeight: isActive ? 700 : 500,
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/songs"
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "#f1a619" : "#111827",
              fontWeight: isActive ? 700 : 500,
            })}
          >
            Canciones
          </NavLink>
          <NavLink
            to="/analytics"
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "#f1a619" : "#111827",
              fontWeight: isActive ? 700 : 500,
            })}
          >
            Analytics
          </NavLink>
          <NavLink
            to="/aficiones"
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "#f1a619" : "#111827",
              fontWeight: isActive ? 700 : 500,
            })}
          >
            Aficiones
          </NavLink>
          <NavLink
            to="/form"
            style={({ isActive }) => ({
              textDecoration: "none",
              color: isActive ? "#f1a619" : "#111827",
              fontWeight: isActive ? 700 : 500,
            })}
          >
            Forms
          </NavLink>
        </nav>
      </header>
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </>
  );
}

function NotFound() {
  return <p>404 · Ruta no encontrada</p>;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Presentation />} />
        <Route path="/songs" element={<Song />} />
        <Route path="/analytics" element={<SongAnalytics />} />
        <Route path="/aficiones" element={<HobbyList />} />
        <Route path="/form" element={<ContactForm />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
