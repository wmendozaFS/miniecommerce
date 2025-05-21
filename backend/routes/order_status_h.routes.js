const express = require('express');
const router = express.Router();
const orderStatusHController = require('../controllers/order_status_h.controller');
// const { verifyToken } = require('../middleware/auth');


router.post('/create', orderStatusHController.createOrderStatusHistory);
router.put('/update/:id', orderStatusHController.updateOrderStatusHistory);
router.delete('/delete/:id', orderStatusHController.deleteOrderStatusHistory);
router.get('/', orderStatusHController.getOrderStatusHistory);
module.exports = router;