import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./contexts/AuthContext";

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Teacher Dashboard */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <TeacherDashboard/>
          </ProtectedRoute>
        }
      />

      {/* Student Dashboard */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to={user ? `/${user.role}` : "/"} />} />
    </Routes>
  );
}
