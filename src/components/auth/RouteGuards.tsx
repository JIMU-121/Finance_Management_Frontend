import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { isTokenValid } from "../../utils/jwt";



type ProtectedRouteProps = {
    
    allowedRoles?: string;
};

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { token, role, isInitialized } = useAuth();

    
    if (!isInitialized) return null;    
    if (!token || !isTokenValid(token)) {
        return <Navigate to="/signin" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}

export function GuestRoute() {
    const { token, isInitialized } = useAuth();
    if (!isInitialized) return null;

    if (token && isTokenValid(token)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
