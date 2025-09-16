import React from "react";
import API from "../api/api";

export default function CreateAssignmentModal({ onClose, fetchAssignments }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const assignment = {
      title: form.title.value,
      description: form.description.value,
      dueDate: form.dueDate.value,
    };
    await API.post("/assignments", assignment);
    fetchAssignments();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Create Assignment</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Title" className="w-full border p-2 mb-2 rounded" required />
          <textarea name="description" placeholder="Description" className="w-full border p-2 mb-2 rounded" />
          <input type="date" name="dueDate" className="w-full border p-2 mb-2 rounded" required />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
            <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
