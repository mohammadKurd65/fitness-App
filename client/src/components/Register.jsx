// client/src/components/Register.jsx
import { useState } from 'react';
import api from '../api';

export default function Register() {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState('');

const handleRegister = async (e) => {
    e.preventDefault();
    try {
    const res = await api.post('/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setMessage('Registered successfully!');
    } catch (err) {
    setMessage(err.response?.data?.message || 'Error occurred');
    }
};

return (
    <form onSubmit={handleRegister}>
    <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <button type="submit">Register</button>
    <p>{message}</p>
    </form>
);
}
