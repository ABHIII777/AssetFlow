import { Navigate } from "react-router-dom";

// TODO: once real auth lands, also validate `allowedRole` against the logged-in user's role
// (e.g. gate "/organization-setup" to Admin only) instead of just checking for a token.
function ProtectedRoute({ children, allowedRole }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;