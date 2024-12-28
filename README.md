# Crypto MT4 Market Data Server

This server provides real-time cryptocurrency market data from Binance in MT4-compatible format.

## Features

- Real-time price updates via WebSocket
- Supports multiple cryptocurrency pairs
- MT4-compatible price format
- REST API endpoints for symbol list and prices

## MT4 Connection Details

- Server Address: your-server-ip
- Port: 8001
- Protocol: WebSocket

## Available Endpoints

- WebSocket: ws://your-server-ip:8001
- HTTP API:
  - GET /symbols - List all available symbols
  - GET /price/:symbol - Get current price for a specific symbol

## Supported Symbols

- BTCUSD (BTCUSDT)
- ETHUSD (ETHUSDT)
- BNBUSD (BNBUSDT)
- XRPUSD (XRPUSDT)
- ADAUSD (ADAUSDT)
- DOGEUSD (DOGEUSDT)
- SOLUSD (SOLUSDT)
- And many more...