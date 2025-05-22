import { useEffect, useState } from 'react';
import axios from 'axios';
import { BiPencil, BiTrash } from 'react-icons/bi';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:4000/api/products');
    setProducts(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get('http://localhost:4000/api/categories/list');
    setCategories(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:4000/api/products', form, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setForm({ name: '', description: '', price: '', stock: '', category_id: '' });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4000/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchProducts();
  };

  const handleEdit = async (product) => {
    const nuevoNombre = prompt('Nuevo nombre', product.name);
    if (!nuevoNombre) return;

    await axios.put(`http://localhost:4000/api/products/${product.id}`, {
      ...product,
      name: nuevoNombre
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchProducts();
  };

  if (!user || user.role !== 'admin') {
    return <div className="alert alert-danger">Acceso restringido solo a administradores.</div>;
  }

  return (
    <div>
      <h2>Gestión de Productos</h2>

      <form onSubmit={handleCreate} className="mb-4">
        <input name="name" placeholder="Nombre" className="form-control mb-2" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Descripción" className="form-control mb-2" value={form.description} onChange={handleChange}></textarea>
        <input name="price" type="number" step="0.01" placeholder="Precio" className="form-control mb-2" value={form.price} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" className="form-control mb-2" value={form.stock} onChange={handleChange} required />
        <select name="category_id" className="form-control mb-2" value={form.category_id} onChange={handleChange} required>
          <option value="">Selecciona categoría</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <button className="btn btn-success">Crear producto</button>
      </form>

      <ul className="list-group">
        {products.map(p => (
          <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{p.name}</strong> — {p.description} — 💰 {p.price}€ — 📦 {p.stock}u
            </div>
            <div>
              <button className="btn btn-outline-warning btn-sm me-2" onClick={() => handleEdit(p)}><BiPencil /></button>
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(p.id)}><BiTrash /></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
