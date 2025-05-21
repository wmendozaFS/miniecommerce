import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const token = localStorage.getItem('token');

  const fetchCategories = async () => {
    const res = await axios.get('http://localhost:4000/api/categories');
    setCategories(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:4000/api/categories', { name: newName }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNewName('');
    fetchCategories();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCategories();
  };

  const handleUpdate = async (id, newName) => {
    await axios.put(`http://localhost:4000/api/categories/${id}`, { name: newName }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Categorías</h2>
      <form onSubmit={handleCreate}>
        <input className="form-control mb-2" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nueva categoría" />
        <button className="btn btn-success">Crear</button>
      </form>
      <ul className="list-group mt-4">
        {categories.map(cat => (
          <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{cat.name}</span>
            <div>
              <button className="btn btn-warning btn-sm me-2" onClick={() => {
                const nuevo = prompt("Nuevo nombre:", cat.name);
                if (nuevo) handleUpdate(cat.id, nuevo);
              }}>Editar</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
