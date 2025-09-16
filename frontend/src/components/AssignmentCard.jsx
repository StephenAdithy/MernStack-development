import React from "react";
import API from "../api/api";

export default function AssignmentCard({ assignment, fetchAssignments }) {
  const handlePublish = async () => {
    await API.put(`/assignments/${assignment._id}/status`, { status: "Published" });
    fetchAssignments();
  };

  const handleComplete = async () => {
    await API.put(`/assignments/${assignment._id}/status`, { status: "Completed" });
    fetchAssignments();
  };

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold">{assignment.title}</h2>
      <p>{assignment.description}</p>
      <p className="text-sm text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
      <p className="mt-2">Status: <span className="font-bold">{assignment.status}</span></p>

      {assignment.status === "Draft" && (
        <button onClick={handlePublish} className="mt-2 bg-green-600 text-white px-3 py-1 rounded">
          Publish
        </button>
      )}

      {assignment.status === "Published" && (
        <button onClick={handleComplete} className="mt-2 bg-yellow-600 text-white px-3 py-1 rounded">
          Mark Completed
        </button>
      )}
    </div>
  );
}
