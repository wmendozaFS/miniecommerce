import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark px-4">
      <Link className="navbar-brand" to="/">Ecommerce</Link>
      <div className="ms-auto">
        <Link className="nav-link d-inline text-light" to="/">Inicio</Link>
        {!user && <Link className="nav-link d-inline text-light" to="/login">Login </Link>}
        {user?.role === 'admin' && (
          <Link className="nav-link d-inline text-light" to="/admin/categories">Categorías</Link>
        )}
        {user && (
          <>
            <span className="text-light mx-2">👤 {user.name}</span>
            <button className="btn btn-outline-light btn-sm" onClick={logout}>Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
}