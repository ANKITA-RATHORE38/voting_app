import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

export default function Results() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/candidate/vote/count")
      .then((res) => setResults(res.data))
      .catch(() => setError("Unable to load results"));
  }, []);

  const totalVotes = results.reduce(
    (sum, candidate) => sum + candidate.count,
    0
  );

  return (
    <div className="app-page">
      <header className="app-header">
        <h2>Election Results</h2>
        <Link to="/dashboard">Dashboard</Link>
      </header>

      <main className="page-content">
        <div className="section-heading">
          <h1>Live Voting Results</h1>
          <p>Current votes received by each party</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{totalVotes}</h3>
            <p>Total Votes Cast</p>
          </div>
          <div className="stat-card">
            <h3>{results.length}</h3>
            <p>Result Entries</p>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="results-panel">
          {results.map((candidate, index) => {
            const percent = totalVotes
              ? (candidate.count / totalVotes) * 100
              : 0;

            return (
              <div className="result-item" key={index}>
                <div className="result-info">
                  <strong>{candidate.party}</strong>
                  <span>
                    {candidate.count} votes ({percent.toFixed(1)}%)
                  </span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}

          {!error && results.length === 0 && (
            <p>No results available yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}