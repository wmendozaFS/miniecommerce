import React from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Admin() {
  const token = localStorage.getItem('token');
  let user = null;

  try {
    user = token ? jwtDecode(token) : null;
  } catch (err) {
    user = null;
  }

  if (!user || user.role !== 'admin') {
    return <div className="alert alert-danger">Acceso restringido. Solo administradores.</div>;
  }

  return (
    <div>
      <h2>Panel de Administración</h2>
      <p>Bienvenido, administrador. Aquí puedes gestionar el ecommerce.</p>

      <ul className="list-group mt-3">
        <li className="list-group-item">
          <Link to="/admin/categories">Gestionar categorías</Link>
        </li>
        <li className="list-group-item">
          <Link to="/admin/products">Gestionar productos</Link>
        </li>
        <li className="list-group-item">
          <Link to="/admin/orders">Gestionar pedidos</Link>
        </li>
      </ul>
    </div>
  );
}
