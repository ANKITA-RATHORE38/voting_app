import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/candidate"),
      api.get("/user/profile")
    ])
      .then(([candidatesRes, userRes]) => {
        setCandidates(candidatesRes.data);
        setUser(userRes.data.user);
      })
      .catch(() => setError("Unable to load dashboard"));
  }, []);

  return (
    <div className="app-page">
      <header className="app-header">
        <h2>🗳️ Online Voting System</h2>
        <nav>
          <Link to="/dashboard">Home</Link>
          <Link to="/vote">Vote</Link>
          <Link to="/results">Results</Link>
          <Link to="/profile">Profile</Link>
          {user?.role === "admin" && (
            <Link to="/admin">Admin</Link>
          )}
        </nav>
      </header>

      <main className="page-content">
        <div className="hero-section">
          <h1>Welcome, {user?.name || "Voter"}!</h1>
          <p>Your voice matters. Make your vote count.</p>
          <Link className="primary-btn" to="/vote">
            Cast Your Vote
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{candidates.length}</h3>
            <p>Total Candidates</p>
          </div>

          <div className="stat-card">
            <h3>{user?.isVoted ? "Completed" : "Pending"}</h3>
            <p>Voting Status</p>
          </div>
        </div>

        <h2>Available Candidates</h2>
        {error && <p className="error-text">{error}</p>}

        <div className="candidate-grid">
          {candidates.map((candidate) => (
            <div className="candidate-card" key={candidate._id}>
              <div className="candidate-avatar">
                {candidate.name?.charAt(0).toUpperCase()}
              </div>
              <h3>{candidate.name}</h3>
              <p>{candidate.party}</p>
              <Link className="primary-btn" to="/vote">
                View Candidate
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}