import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import NewNote from "./pages/NewNote";
import Archive from "./pages/Archive";
import NoteDetail from "./pages/NoteDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function DashboardLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Home />} />
            <Route path="notes/new" element={<NewNote />} />
            <Route path="archives" element={<Archive />} />
            <Route path="notes/:id" element={<NoteDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
