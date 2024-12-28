const express = require('express');
const WebSocket = require('ws');
const Binance = require('binance-api-node').default;
const Decimal = require('decimal.js');

const app = express();
const wss = new WebSocket.Server({ port: 8001 });
const binanceClient = Binance();

// MT4 compatible symbol mapping
const symbolMapping = {
  'BTCUSDT': 'BTCUSD',
  'ETHUSDT': 'ETHUSD',
  'BNBUSDT': 'BNBUSD',
  'XRPUSDT': 'XRPUSD',
  'ADAUSDT': 'ADAUSD',
  'DOGEUSDT': 'DOGEUSD',
  'SOLUSDT': 'SOLUSD',
  // Add more symbols as needed
};

// Store latest prices
const prices = new Map();

// Convert Binance price to MT4 format
function formatMT4Price(symbol, price, volume) {
  return {
    symbol: symbolMapping[symbol] || symbol,
    bid: new Decimal(price).toFixed(8),
    ask: new Decimal(price).plus(0.00001).toFixed(8),
    volume: volume,
    timestamp: Date.now()
  };
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('MT4 client connected');

  // Send initial prices
  prices.forEach((price, symbol) => {
    ws.send(JSON.stringify(price));
  });

  ws.on('close', () => {
    console.log('MT4 client disconnected');
  });
});

// Start Binance WebSocket streams
async function startBinanceStreams() {
  try {
    // Get all trading pairs
    const exchangeInfo = await binanceClient.exchangeInfo();
    const symbols = exchangeInfo.symbols
      .filter(s => s.quoteAsset === 'USDT')
      .map(s => s.symbol);

    // Subscribe to ticker streams
    binanceClient.ws.trades(symbols, trade => {
      const mt4Price = formatMT4Price(trade.symbol, trade.price, trade.quantity);
      prices.set(trade.symbol, mt4Price);

      // Broadcast to all connected MT4 clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(mt4Price));
        }
      });
    });
  } catch (error) {
    console.error('Error starting Binance streams:', error);
  }
}

// HTTP endpoints for MT4
app.get('/symbols', (req, res) => {
  res.json(Array.from(prices.keys()).map(symbol => symbolMapping[symbol] || symbol));
});

app.get('/price/:symbol', (req, res) => {
  const price = prices.get(req.params.symbol);
  if (price) {
    res.json(price);
  } else {
    res.status(404).json({ error: 'Symbol not found' });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('WebSocket server running on port 8001');
  startBinanceStreams();
});