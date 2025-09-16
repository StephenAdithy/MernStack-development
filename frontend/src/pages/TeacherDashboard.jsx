import React, { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../contexts/AuthContext";
import AssignmentCard from "../components/AssignmentCard";
import CreateAssignmentModal from "../components/CreateAssignmentModal";

export default function TeacherDashboard() {
  const { logout } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchAssignments = async () => {
    const { data } = await API.get("/assignments");
    setAssignments(data.items || []);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Create Assignment
      </button>

      <div className="mt-6 grid gap-4">
        {assignments.map((a) => (
          <AssignmentCard key={a._id} assignment={a} fetchAssignments={fetchAssignments} />
        ))}
      </div>

      {showModal && (
        <CreateAssignmentModal
          onClose={() => setShowModal(false)}
          fetchAssignments={fetchAssignments}
        />
      )}
    </div>
  );
}
