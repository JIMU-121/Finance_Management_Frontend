import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { isTokenValid } from "../../utils/jwt";

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
// Wraps any route that requires the user to be logged in.
// Waits for AuthContext to finish restoring the session before deciding.

type ProtectedRouteProps = {
    /** Allowed roles. If empty/undefined, any authenticated user is allowed. */
    allowedRoles?: string[];
};

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { token, role, isInitialized } = useAuth();

    //  Still restoring session from storage — render nothing yet
    if (!isInitialized) return null;

    // Not logged in or token expired
    if (!token || !isTokenValid(token)) {
        return <Navigate to="/signin" replace />;
    }

    // Logged in but wrong role
    if (allowedRoles && allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}

// ─── GuestRoute ───────────────────────────────────────────────────────────────
// Wraps auth pages (sign-in, sign-up).
// If user is already logged in → redirect them to the dashboard.

export function GuestRoute() {
    const { token, isInitialized } = useAuth();

    //  Still restoring session from storage — render nothing yet
    if (!isInitialized) return null;

    if (token && isTokenValid(token)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
