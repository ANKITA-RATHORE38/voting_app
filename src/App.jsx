import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import Vote from "./pages/Vote";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />

        <Route
          path="/vote"
          element={<ProtectedRoute><Vote /></ProtectedRoute>}
        />

        <Route
          path="/results"
          element={<ProtectedRoute><Results /></ProtectedRoute>}
        />

        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />

        <Route
          path="/admin"
          element={<ProtectedRoute><Admin /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;