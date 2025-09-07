// client/src/components/UpdateProfile.jsx
import { useState } from 'react';
import api from '../api';

export default function UpdateProfile() {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState('');

const handleUpdate = async (e) => {
    e.preventDefault();
    try {
    const res = await api.put('/update-profile', { name, email, password });
    setMessage('Profile updated successfully!');
    } catch (err) {
    setMessage(err.response?.data?.message || 'Error occurred');
    }
};

return (
    <form onSubmit={handleUpdate}>
    <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <button type="submit">Update Profile</button>
    <p>{message}</p>
    </form>
);
}
