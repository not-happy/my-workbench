import { Router } from 'express';
import {
  searchFlights,
  verifyPrice,
  queryBaggage,
  querySeatMap,
  createOrder,
  verifyPayment,
  issueTicket,
  getTicketNumbers
} from '../controllers/supplierController';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: '个人工作台 API 运行正常',
    timestamp: new Date().toISOString()
  });
});

// Example API endpoint
router.get('/hello', (req, res) => {
  res.json({ 
    message: 'Hello from the API!',
    timestamp: new Date().toISOString()
  });
});

// 供应商测试 API 路由
router.post('/supplier/search', searchFlights);
router.post('/supplier/price-verify', verifyPrice);
router.post('/supplier/baggage-query', queryBaggage);
router.post('/supplier/seat-map', querySeatMap);
router.post('/supplier/create-order', createOrder);
router.post('/supplier/payment-verify', verifyPayment);
router.post('/supplier/issue-ticket', issueTicket);
router.post('/supplier/get-ticket-numbers', getTicketNumbers);

export default router;
