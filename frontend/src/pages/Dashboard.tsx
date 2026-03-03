import React, { useState } from 'react';
import { useGetPowerCutsQuery, useGetSubscriptionsQuery, useSubscribeTopicMutation } from '../store/api';
import keycloak from '../keycloak';

const Dashboard: React.FC = () => {
    const [areaParam, setAreaParam] = useState('');
    const [searchArea, setSearchArea] = useState('');

    const { data: pcData, isLoading: isLoadingPC } = useGetPowerCutsQuery({ area: searchArea });
    const { data: subsData, isLoading: isLoadingSubs, refetch } = useGetSubscriptionsQuery(undefined);
    const [subscribe] = useSubscribeTopicMutation();

    const handleSubscribe = async (area: string) => {
        try {
            if (!area) return;
            await subscribe({ area }).unwrap();
            refetch();
        } catch (err: any) {
            alert(err.data?.message || 'Failed to subscribe');
        }
    };

    const handleLogout = () => {
        keycloak.logout();
    };

    const powerCuts = pcData?.data || [];
    const subscriptions = subsData || [];

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-primary">Power Cut Notifications</h1>
                <div>
                    <span className="me-3">Welcome, {keycloak.tokenParsed?.preferred_username}</span>
                    <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Upcoming Power Cuts</h5>
                            <div className="d-flex">
                                <input
                                    type="text"
                                    className="form-control form-control-sm me-2"
                                    placeholder="Filter by area..."
                                    value={areaParam}
                                    onChange={(e) => setAreaParam(e.target.value)}
                                />
                                <button className="btn btn-sm btn-primary" onClick={() => setSearchArea(areaParam)}>Search</button>
                            </div>
                        </div>
                        <div className="card-body">
                            {isLoadingPC ? <p>Loading...</p> : (
                                powerCuts.length === 0 ? <p className="text-muted">No power cuts scheduled.</p> : (
                                    <ul className="list-group">
                                        {powerCuts.map((pc: any) => (
                                            <li key={pc.id} className="list-group-item">
                                                <strong>{pc.area}</strong> - {new Date(pc.date).toLocaleDateString()} ({pc.start_time} to {pc.end_time})
                                                {pc.reason && <p className="mb-0 text-muted small">Reason: {pc.reason}</p>}
                                            </li>
                                        ))}
                                    </ul>
                                )
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">My Subscriptions</h5>
                        </div>
                        <div className="card-body">
                            <div className="input-group mb-3">
                                <input type="text" id="sub-area" className="form-control" placeholder="Area Name" />
                                <button className="btn btn-outline-secondary" onClick={() => {
                                    const el = document.getElementById('sub-area') as HTMLInputElement;
                                    handleSubscribe(el.value);
                                    el.value = '';
                                }}>Subscribe</button>
                            </div>
                            {isLoadingSubs ? <p>Loading...</p> : (
                                <ul className="list-group">
                                    {subscriptions.map((sub: any) => (
                                        <li key={sub.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            {sub.area}
                                        </li>
                                    ))}
                                    {subscriptions.length === 0 && <p className="text-muted">No active subscriptions.</p>}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
