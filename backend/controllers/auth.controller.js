const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ msg: 'El correo ya está registrado.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, role]);

    res.json({ msg: 'Usuario registrado correctamente.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error interno.', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ msg: 'Usuario no encontrado.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: 'Contraseña incorrecta.' });

    const token = jwt.sign({  id: user.id, name: user.name, role: user.role}, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Error interno.', error: err.message });
  }
};

exports.logout = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(400).json({ msg: 'Token no proporcionado' });

  try {
    // Opcional: podrías obtener fecha de expiración exacta del JWT
    await pool.query('INSERT INTO token_blacklist (token) VALUES (?)', [token]);
    res.json({ msg: 'Token invalidado. Logout exitoso.' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al cerrar sesión.', error: error.message });
  }
};
  

