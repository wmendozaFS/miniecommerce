import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // 👈 redirige al home
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark px-4">
      <Link className="navbar-brand" to="/">Ecommerce</Link>
      <div className="ms-auto">
        <Link className="nav-link d-inline text-light" to="/">Inicio</Link>
        {!user && <Link className="nav-link d-inline text-light" to="/login">Login</Link>}
        {user?.role === 'admin' && (
          <>
            <Link className="nav-link d-inline text-light" to="/admin">Admin</Link>
            <Link className="nav-link d-inline text-light" to="/admin/categories">Categorías</Link>
            <Link className="nav-link d-inline text-light" to="/admin/products">Productos</Link>
          </>
       )}
        {user && (
          <>
            <span className="text-light mx-2">👤 {user.name}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
