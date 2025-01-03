import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";
import InstructorDashboard from "./InstructorDashboard";

function DashboardPage() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/dashboard" replace />;
  }

  return user.role === "instructor" ? (
    <InstructorDashboard />
  ) : (
    <StudentDashboard />
  );
}

export default DashboardPage;
