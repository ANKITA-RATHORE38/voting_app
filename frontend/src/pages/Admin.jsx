import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

export default function Admin() {
  const [candidates, setCandidates] = useState([]);
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({ name: "", party: "", age: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCandidates = async () => {
    const res = await api.get("/candidate");
    setCandidates(res.data);
  };

  useEffect(() => {
    api.get("/user/profile")
      .then(async (res) => {
        setRole(res.data.user.role);
        if (res.data.user.role === "admin") {
          await loadCandidates();
        }
      })
      .catch(() => setError("Unable to verify admin access"));
  }, []);

  const resetForm = () => {
    setForm({ name: "", party: "", age: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const data = {
        name: form.name,
        party: form.party,
        age: Number(form.age)
      };

      if (editingId) {
        await api.put(`/candidate/${editingId}`, data);
        setMessage("Candidate updated successfully");
      } else {
        await api.post("/candidate", data);
        setMessage("Candidate added successfully");
      }

      resetForm();
      await loadCandidates();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Operation failed"
      );
    }
  };

  const handleEdit = (candidate) => {
    setEditingId(candidate._id);
    setForm({
      name: candidate.name,
      party: candidate.party,
      age: candidate.age || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this candidate?")) return;

    try {
      await api.delete(`/candidate/${id}`);
      setMessage("Candidate deleted successfully");
      setError("");
      await loadCandidates();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Delete failed"
      );
    }
  };

  if (role !== "admin") {
    return (
      <div className="app-page">
        <main className="page-content">
          <h2>
            {role === null && !error
              ? "Checking permissions..."
              : "Access Denied"}
          </h2>
          <p>{error || (role ? "Admin access required." : "")}</p>
          <Link to="/dashboard">Return to Dashboard</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="app-page">
      <header className="app-header">
        <h2>Admin Dashboard</h2>
        <Link to="/dashboard">Dashboard</Link>
      </header>

      <main className="page-content">
        <div className="section-heading">
          <h1>Candidate Management</h1>
          <p>Add, update and remove election candidates.</p>
        </div>

        {message && <div className="success-box">{message}</div>}
        {error && <div className="error-box">{error}</div>}

        <div className="admin-layout">
          <div className="admin-panel">
            <h2>{editingId ? "Edit Candidate" : "Add Candidate"}</h2>

            <form className="app-form" onSubmit={handleSubmit}>
              <label>Candidate Name</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              <label>Political Party</label>
              <input
                value={form.party}
                onChange={(e) =>
                  setForm({ ...form, party: e.target.value })
                }
                required
              />

              <label>Age</label>
              <input
                type="number"
                min="18"
                value={form.age}
                onChange={(e) =>
                  setForm({ ...form, age: e.target.value })
                }
                required
              />

              <button type="submit" className="primary-btn">
                {editingId ? "Save Changes" : "Add Candidate"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={resetForm}
                >
                  Cancel Editing
                </button>
              )}
            </form>
          </div>

          <div className="admin-panel">
            <h2>Candidate List</h2>

            {candidates.map((candidate) => (
              <div className="admin-candidate" key={candidate._id}>
                <div>
                  <strong>{candidate.name}</strong>
                  <p>{candidate.party}</p>
                </div>

                <div className="admin-actions">
                  <button
                    className="secondary-btn"
                    onClick={() => handleEdit(candidate)}
                  >
                    Edit
                  </button>

                  <button
                    className="danger-btn"
                    onClick={() => handleDelete(candidate._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}