import React, { useState } from 'react';
import { useGetPowerCutsQuery, useCreatePowerCutMutation, useDeletePowerCutMutation } from '../store/api';
import keycloak from '../keycloak';

const AdminDashboard: React.FC = () => {
    const { data: pcData, isLoading, refetch } = useGetPowerCutsQuery({});
    const [createPowerCut] = useCreatePowerCutMutation();
    const [deletePowerCut] = useDeletePowerCutMutation();

    const [form, setForm] = useState({ area: '', date: '', start_time: '', end_time: '', reason: '' });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createPowerCut(form).unwrap();
            refetch();
            setForm({ area: '', date: '', start_time: '', end_time: '', reason: '' });
        } catch (err: any) {
            alert("Error: " + (err.data?.error || err.data?.message || JSON.stringify(err)));
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure?")) {
            await deletePowerCut(id).unwrap();
            refetch();
        }
    };

    const powerCuts = pcData?.data || [];

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-danger">Admin Dashboard</h1>
                <div><button className="btn btn-outline-dark" onClick={() => keycloak.logout()}>Logout</button></div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Schedule Power Cut</h5>
                            <form onSubmit={handleCreate}>
                                <div className="mb-2">
                                    <label>Area</label>
                                    <input type="text" className="form-control" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} required />
                                </div>
                                <div className="mb-2">
                                    <label>Date</label>
                                    <input type="date" className="form-control" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                                </div>
                                <div className="mb-2">
                                    <label>Start Time (HH:MM)</label>
                                    <input type="time" className="form-control" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} required />
                                </div>
                                <div className="mb-2">
                                    <label>End Time (HH:MM)</label>
                                    <input type="time" className="form-control" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label>Reason</label>
                                    <input type="text" className="form-control" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
                                </div>
                                <button type="submit" className="btn btn-danger w-100">Schedule</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">All Power Cuts</h5>
                            {isLoading ? <p>Loading...</p> : (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Area</th><th>Date</th><th>Duration</th><th>Reason</th><th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {powerCuts.map((pc: any) => (
                                            <tr key={pc.id}>
                                                <td>{pc.area}</td>
                                                <td>{new Date(pc.date).toLocaleDateString()}</td>
                                                <td>{pc.start_time} - {pc.end_time}</td>
                                                <td>{pc.reason}</td>
                                                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(pc.id)}>Delete</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
