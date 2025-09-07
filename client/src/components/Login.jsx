// client/src/components/Login.jsx
import { useState } from 'react';
import api from '../api';

export default function Login() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [message, setMessage] = useState('');

const handleLogin = async (e) => {
    e.preventDefault();
    try {
    const res = await api.post('/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setMessage('Logged in successfully!');
    } catch (err) {
    setMessage(err.response?.data?.message || 'Error occurred');
    }
};

return (
    <form onSubmit={handleLogin}>
    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <button type="submit">Login</button>
    <p>{message}</p>
    </form>
);
}
