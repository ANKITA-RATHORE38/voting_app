import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

export default function Vote() {
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/candidate"),
      api.get("/user/profile")
    ])
      .then(([candidatesRes, userRes]) => {
        const list = candidatesRes.data;

        console.log("Candidates:", list);

        if (
          !Array.isArray(list) ||
          list.some((c) => !c._id) ||
          new Set(list.map((c) => c._id)).size !== list.length
        ) {
          setError("Candidate IDs are missing or duplicated. Check backend.");
          return;
        }

        setCandidates(list);
        setUser(userRes.data.user);
      })
      .catch(() => setError("Unable to load voting details"));
  }, []);

  const handleVote = async () => {
    if (loading || user?.isVoted || user?.role === "admin") return;

    const candidate = candidates.find((c) => c._id === selected);

    if (!candidate) {
      setError("Please select a valid candidate.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to vote for ${candidate.name} (${candidate.party})?`
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      console.log("Voting for:", candidate.name);
      console.log("Candidate ID:", candidate._id);

      const res = await api.post(
        `/candidate/vote/${candidate._id}`
      );

      setMessage(res.data.message || "Vote submitted successfully.");
      setUser((prev) => ({ ...prev, isVoted: true }));
      setSelected("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Voting failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page">
      <header className="app-header">
        <h2>🗳️ Cast Your Vote</h2>
        <Link to="/dashboard">Back to Dashboard</Link>
      </header>

      <main className="page-content">
        <div className="section-heading">
          <h1>Select Your Candidate</h1>
          <p>You can vote for only one candidate.</p>
        </div>

        {user?.isVoted && (
          <div className="success-box">
            You have already cast your vote.
          </div>
        )}

        {user?.role === "admin" && (
          <div className="error-box">
            Administrators cannot vote.
          </div>
        )}

        {message && <div className="success-box">{message}</div>}
        {error && <div className="error-box">{error}</div>}

        <div className="candidate-grid">
          {candidates.map((candidate) => (
            <label
              key={candidate._id}
              className={`candidate-card selectable ${
                selected === candidate._id ? "selected" : ""
              }`}
            >
              <div className="candidate-avatar">
                {candidate.name?.charAt(0).toUpperCase()}
              </div>

              <h3>{candidate.name}</h3>
              <p>{candidate.party}</p>

              <input
                type="radio"
                name="candidate"
                value={candidate._id}
                checked={selected === candidate._id}
                onChange={() => {
                  setSelected(candidate._id);
                  setError("");
                }}
                disabled={
                  !user ||
                  user.isVoted ||
                  user.role === "admin" ||
                  loading
                }
              />
            </label>
          ))}
        </div>

        <div className="center-actions">
          <button
            className="primary-btn"
            onClick={handleVote}
            disabled={
              !selected ||
              !user ||
              user.isVoted ||
              user.role === "admin" ||
              loading
            }
          >
            {loading ? "Submitting..." : "Submit Vote"}
          </button>
        </div>
      </main>
    </div>
  );
}