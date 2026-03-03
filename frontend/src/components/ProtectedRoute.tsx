import React from 'react';
import { Outlet } from 'react-router-dom';
import keycloak from '../keycloak';

interface ProtectedRouteProps {
    role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
    if (!keycloak.authenticated) {
        keycloak.login();
        return <div className="container mt-5 text-center">Redirecting to login...</div>;
    }

    if (role) {
        const realmRoles = keycloak.realmAccess?.roles || [];
        const clientRoles = keycloak.resourceAccess?.[import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'powercut-client']?.roles || [];

        if (!realmRoles.includes(role) && !clientRoles.includes(role)) {
            return (
                <div className="container mt-5 text-center">
                    <h2 className="text-danger">Access Denied</h2>
                    <p>You do not have the required permissions ({role}) to view this page.</p>
                </div>
            );
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
