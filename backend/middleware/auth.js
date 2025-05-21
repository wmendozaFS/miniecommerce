const jwt = require('jsonwebtoken');

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ msg: 'Token requerido.' });

  const token = authHeader.split(' ')[1];

  try {
    // 🔍 Verificar que el token no esté en la blacklist
    const [rows] = await pool.query('SELECT * FROM token_blacklist WHERE token = ?', [token]);
    if (rows.length > 0) {
      return res.status(401).json({ msg: 'Token revocado. Haz login de nuevo.' });
    }

    // 🔐 Verificar validez del JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido o expirado.' });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Solo administradores.' });
  next();
};
