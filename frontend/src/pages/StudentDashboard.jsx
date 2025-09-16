import React, { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../contexts/AuthContext";

export default function StudentDashboard() {
  const { logout } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [answers, setAnswers] = useState({});

  const fetchAssignments = async () => {
    const { data } = await API.get("/assignments");
    setAssignments(data.items || []);
  };

  const fetchMySubmissions = async (assignmentId) => {
    try {
      const { data } = await API.get(`/submissions/mine/${assignmentId}`);
      setAnswers((prev) => ({ ...prev, [assignmentId]: data.answer }));
    } catch {
      // no submission yet
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>

      <div className="space-y-4">
        {assignments.map((a) => (
          <div key={a._id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{a.title}</h2>
            <p>{a.description}</p>
            <p className="text-sm text-gray-500">Due: {new Date(a.dueDate).toLocaleDateString()}</p>

            {answers[a._id] ? (
              <p className="mt-2 text-green-600">
                ✅ Submitted: {answers[a._id]}
              </p>
            ) : (
              <form
                className="mt-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const answer = e.target.answer.value;
                  await API.post("/submissions", { assignmentId: a._id, answer });
                  fetchMySubmissions(a._id);
                }}
              >
                <textarea name="answer" className="w-full border p-2 rounded mb-2" required />
                <button className="bg-blue-600 text-white px-3 py-1 rounded">Submit</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
