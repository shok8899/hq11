# 加密货币 MT4 行情服务器部署指南

## 1. 服务器要求

- Node.js 16+ 
- 2GB RAM (最低)
- 稳定的网络连接
- Ubuntu 20.04 或更高版本（推荐）

## 2. 部署步骤

### 2.1 安装 Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2.2 部署代码
```bash
# 克隆代码
git clone [您的代码仓库地址]
cd crypto-mt4-server

# 安装依赖
npm install

# 启动服务
npm start
```

### 2.3 使用 PM2 管理进程（推荐）
```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start server.js --name crypto-mt4

# 设置开机自启
pm2 startup
pm2 save
```

## 3. MT4 客户端配置

### 3.1 添加自定义服务器
1. 打开 MT4
2. 点击"文件" -> "登录到交易服务器"
3. 点击"新建"
4. 填写服务器信息：
   - 服务器名称：任意名称
   - 服务器地址：您的服务器IP
   - 端口：8001

### 3.2 连接服务器
1. 选择新添加的服务器
2. 点击"登录"（无需输入账号密码）
3. 等待连接成功

## 4. 可用交易品种

服务器支持所有 Binance 上的 USDT 交易对，包括：
- BTCUSD (BTCUSDT)
- ETHUSD (ETHUSDT)
- BNBUSD (BNBUSDT)
等多个交易品种

## 5. 故障排查

### 5.1 检查服务器状态
```bash
# 检查服务运行状态
pm2 status

# 查看日志
pm2 logs crypto-mt4
```

### 5.2 常见问题
1. 无法连接：
   - 检查服务器防火墙是否开放 8001 端口
   - 确认服务器 IP 地址是否正确

2. 数据延迟：
   - 检查服务器网络状态
   - 查看服务器负载情况

## 6. 安全建议

1. 配置防火墙
```bash
sudo ufw allow 8001
sudo ufw enable
```

2. 定期更新系统
```bash
sudo apt update
sudo apt upgrade
```

3. 监控服务器资源使用
```bash
# 安装监控工具
npm install -g node-clinic

# 运行监控
clinic doctor -- node server.js
```