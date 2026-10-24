import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/user/profile")
      .then((res) => setUser(res.data.user))
      .catch(() => setError("Unable to load profile"));
  }, []);

  const changePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.put("/user/profile/password", {
        currentPassword,
        newPassword
      });

      setMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Password update failed");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-page">
      <header className="app-header">
        <h2>My Profile</h2>
        <Link to="/dashboard">Dashboard</Link>
      </header>

      <main className="page-content">
        <div className="profile-card">
          <div className="candidate-avatar large-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <h2>{user?.name || "User Profile"}</h2>

          {user && (
            <div className="profile-details">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Age:</strong> {user.age}</p>
              <p><strong>Mobile:</strong> {user.mobile}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p>
                <strong>Voting Status:</strong>{" "}
                {user.isVoted ? "Voted" : "Not Voted"}
              </p>
            </div>
          )}

          {error && <p className="error-text">{error}</p>}

          <button className="danger-btn" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="profile-card">
          <h2>Change Password</h2>

          <form onSubmit={changePassword} className="app-form">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            {message && <p className="success-text">{message}</p>}

            <button className="primary-btn" type="submit">
              Update Password
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}