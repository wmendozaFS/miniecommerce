const pool = require('../config/db');

exports.createOrderStatusHistory = async (req, res) => { 
    const { order_id, status } = req.body;
    console.log('Creando Order Status:', name);
    if (!order_id) {
        return res.status(400).json({ message: 'El status es requerido' });
    }

    try {
    const [existing] = await pool.query('SELECT * FROM order_status_history WHERE order_id = ?', [order_id]);
    if (existing.length > 0) return res.status(409).json({ msg: 'el estatus ya existe.' });

    await pool.query('INSERT INTO order_status_history (order_id, status) VALUES (?, ?)', [order_id, status]);
    res.status(201).json({ msg: 'Status creada correctamente.' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear Status.', error: error.message });
  }
};

exports.updateOrderStatusHistory = async (req, res) => { 
    const orderid =req.params.id;
    const {status } = req.body;
    console.log('Actualizando Order Status:', status);
    if (!status) {
        return res.status(400).json({ message: 'El status es requerido' });
    }

    try {
    const [rows]=await pool.query('UPDATE order_status_history SET status=? WHERE id=?', [status, orderid]);
    
    if (rows.affectedRows === 0){
        return res.status(404).json({msg:"Order no encontrada"})
    }
    res.status(201).json({ msg: 'Status actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar Status.', error: error.message });
  }
};

exports.deleteOrderStatusHistory = async (req, res) => {
    const orderid =req.params.id;
    try {
        const [rows] = await pool.query('DELETE FROM order_status_history WHERE id=?', [orderid]);
         if (rows.affectedRows === 0){
            return res.status(404).json({msg:"Order no encontrada"});
         }
    res.status(201).json({ msg: 'Status eliminar correctamente.' });
    } catch (error) {
    res.status(500).json({ msg: 'Error al Eliminar Status.', error: error.message });
    };
};

exports.getOrderStatusHistory = async (req, res) => {
    try {
        const [order_status_history] = await pool.query('SELECT * FROM order_status_history');
        res.status(200).json(order_status_history);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener Status.', error: error.message });
    }
}