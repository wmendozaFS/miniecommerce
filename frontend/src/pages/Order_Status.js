import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BiPencil, BiTrash } from 'react-icons/bi';

export default function OrderStatus() {
  const [statusOrder, setOrderStatus] = useState([]);
  const [newStatus, setNewStatusO] = useState('');
  const [sort, setSort] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const token = localStorage.getItem('token');

  // Obtener categorías del backend
  const fetchStatusO = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/categories/list');
      setOrderStatus(res.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  // Crear nueva categoría
  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:4000/api/categories/create', { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNewStatusO('');
    fetchStatusO();
  };

  // Eliminar
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/api/categories/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCategories();
  };

  // Actualizar
  const handleUpdate = async (id, status) => {
    await axios.put(`http://localhost:4000/api/categories/update/${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ ORDENAMIENTO
  const sortedCategories = [...statusOrder].sort((a, b) => {
    return sort === 'asc'
      ? a.status.localeCompare(b.status)
      : b.status.localeCompare(a.status);
  });

  // ✅ PAGINACIÓN
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);

  // ✅ RENDER
  return (
    <div>
      <h2>Orders Status</h2>

      {/* Crear nueva */}
      <form onSubmit={handleCreate} className="mb-3">
        <input
          className="form-control mb-2"
          value={newStatus}
          onChange={(e) => setNewStatusO(e.target.value)}
          placeholder="Nueva status"
        />
        <button className="btn btn-success">Crear</button>
      </form>

      {/* Orden */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>Total: {categories.length}</strong>
        <select
          className="form-select w-auto"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </select>
      </div>

      {/* Lista paginada */}
      <ul className="list-group">
        {currentItems.map((cat) => (
          <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
            {cat.status}
            <div>
              <button
                className="btn btn-outline-warning btn-sm me-2"
                onClick={() => {
                  const nuevo = prompt('Nuevo Status:', cat.status);
                  if (nuevo) handleUpdate(cat.id, nuevo);
                }}
              >
                <BiPencil />
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleDelete(cat.id)}
              >
                <BiTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Paginación */}
      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <li
              key={idx}
              className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}
            >
              <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>
                {idx + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
