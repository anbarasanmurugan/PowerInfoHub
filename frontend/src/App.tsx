import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import keycloak from './keycloak';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const [keycloakInitialized, setKeycloakInitialized] = useState(false);

    useEffect(() => {
        keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).then(() => {
            setKeycloakInitialized(true);
        }).catch(console.error);
    }, []);

    if (!keycloakInitialized) {
        return <div className="d-flex justify-content-center align-items-center vh-100"><h3>Loading Auth...</h3></div>;
    }

    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route element={<ProtectedRoute role="user" />}>
                        <Route path="/" element={<Dashboard />} />
                    </Route>

                    <Route element={<ProtectedRoute role="admin" />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
