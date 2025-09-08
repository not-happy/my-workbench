import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes/api';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
// 使用环境变量，默认为3002

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);

// 雪球财经API代理 - 集成股票数据服务
app.use('/api/stock/proxy', createProxyMiddleware({
  target: 'https://stock.xueqiu.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/stock/proxy': ''
  },
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    'Origin': 'https://xueqiu.com',
    'Referer': 'https://xueqiu.com/',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
  },
  // 处理Cookie转发
  onProxyReq: (proxyReq, req, res) => {
    // 添加必要的Cookie（需要从真实请求中获取）
    const cookies = [
      'cookiesu=171732082835225',
      'device_id=d06912f526eb5e678407d48ce5a0bfc9',
      's=bs1ubj09xs',
      'bid=8bd45b2e641761cbaa3d12295ffdca66_m3wmtsyj',
      'xq_a_token=59e544a9aaf1a21d8f8d90edff7456206012d679',
      'xqat=59e544a9aaf1a21d8f8d90edff7456206012d679',
      'xq_r_token=cfc786e232ed6b89dc3f954ce814983b105ded6c',
      'u=171732082835225'
    ];
    proxyReq.setHeader('Cookie', cookies.join('; '));
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`📊 雪球代理响应: ${req.url} - ${proxyRes.statusCode}`);
    
    // 获取请求的来源
    const origin = req.headers.origin;
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'];
    
    // 动态设置CORS头部
    if (origin && allowedOrigins.includes(origin)) {
      proxyRes.headers['access-control-allow-origin'] = origin;
    } else {
      proxyRes.headers['access-control-allow-origin'] = 'http://localhost:5173';
    }
    
    proxyRes.headers['access-control-allow-credentials'] = 'true';
    proxyRes.headers['access-control-allow-headers'] = 'Content-Type, Authorization, Accept, X-Requested-With';
    proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
  },
  onError: (err, req, res) => {
    console.error('❌ 雪球代理错误:', err.message);
    res.status(500).json({
      error: '股票数据代理服务错误',
      message: err.message
    });
  }
}));

// 股票数据测试接口
app.get('/api/stock/test/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const count = req.query.count || 10;
    
    res.json({
      message: `测试获取 ${symbol} 的股票数据`,
      symbol,
      count,
      proxyUrl: `/api/stock/proxy/v5/stock/history/trade.json?symbol=${symbol}&count=${count}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: '测试接口错误',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 个人工作台后端服务启动成功`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`� 健康检查: http://localhost:${PORT}/health`);
  console.log(`🔗 API接口: http://localhost:${PORT}/api`);
  console.log(`📊 股票代理: http://localhost:${PORT}/api/stock/proxy`);
  console.log(`🧪 股票测试: http://localhost:${PORT}/api/stock/test/SH600519`);
  console.log(`💹 示例调用: http://localhost:${PORT}/api/stock/proxy/v5/stock/history/trade.json?symbol=SH600519&count=10`);
});

export default app;
