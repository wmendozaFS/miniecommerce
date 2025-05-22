const pool = require('../config/db');

exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT products.*, categories.name AS category_name
      FROM products
      LEFT JOIN categories ON products.category_id = categories.id
      ORDER BY products.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener productos', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, stock, category_id } = req.body;
  try {
    await pool.query(`
      INSERT INTO products (name, description, price, stock, category_id)
      VALUES (?, ?, ?, ?, ?)
    `, [name, description, price, stock, category_id]);
    res.status(201).json({ msg: 'Producto creado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear producto', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, description, price, stock, category_id } = req.body;
  try {
    const [exist] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (exist.length === 0) return res.status(404).json({ msg: 'Producto no encontrado' });

    await pool.query(`
      UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ?
      WHERE id = ?
    `, [name, description, price, stock, category_id, id]);
    res.json({ msg: 'Producto actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar producto', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ msg: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar producto', error: error.message });
  }
};
