import { Routes, Route, Navigate } from "react-router-dom"

import Loader from "./components/loader";
import Login from "./layout/auth/login";
import Signup from "./layout/auth/signup";
import VerifyEmail from "./layout/auth/verifyEmail";
import ProtectedRoute from "./components/protectedRoute";
import Dashboard from "./layout/dashboard/dashboard";

import { useSelector } from "react-redux";
import AuthSuccess from "./layout/auth/auth-success";
import Profile from "./layout/dashboard/profile";

function App() {
  const { loader } = useSelector(state => state.loaderReducer);

  return (
    <div>
      {loader && <Loader />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
