import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark px-4">
      <Link className="navbar-brand" to="/">Ecommerce</Link>
      <div>
        <Link className="nav-link d-inline text-light" to="/">Inicio</Link>
        <Link className="nav-link d-inline text-light" to="/login">Login</Link>
        <Link className="nav-link d-inline text-light" to="/admin/categories">Categorías</Link>
      </div>
    </nav>
  );
}