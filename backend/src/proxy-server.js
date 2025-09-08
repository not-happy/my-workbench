const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3001;

// 启用CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// 雪球财经API代理
app.use('/api/proxy', createProxyMiddleware({
  target: 'https://stock.xueqiu.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/proxy': ''
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
    console.log(`代理响应: ${req.url} - ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('代理错误:', err.message);
    res.status(500).json({
      error: '代理服务错误',
      message: err.message
    });
  }
}));

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '股票数据代理服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// 测试接口
app.get('/test/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const count = req.query.count || 10;
    
    res.json({
      message: `测试获取 ${symbol} 的股票数据`,
      symbol,
      count,
      proxyUrl: `/api/proxy/v5/stock/history/trade.json?symbol=${symbol}&count=${count}`
    });
  } catch (error) {
    res.status(500).json({
      error: '测试接口错误',
      message: error.message
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 股票数据代理服务启动成功`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🔍 健康检查: http://localhost:${PORT}/health`);
  console.log(`📊 测试接口: http://localhost:${PORT}/test/stock/SH600519`);
  console.log(`🔄 代理接口: http://localhost:${PORT}/api/proxy/v5/stock/history/trade.json?symbol=SH600519&count=10`);
});

module.exports = app;
