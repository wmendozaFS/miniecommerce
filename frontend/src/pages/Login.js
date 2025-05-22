import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      login(res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error al hacer login');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" className="form-control mb-2" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" className="form-control mb-2" value={password} onChange={e => setPassword(e.target.value)} required />
      <button className="btn btn-primary">Entrar</button>
    </form>
  );
}
