# Cloudflare Worker 部署指南

## 快速部署（推荐）

### 1. 安装 wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```
浏览器会打开，授权登录你的 Cloudflare 账号。

### 3. 部署 Worker

```bash
cd cloudflare-worker
wrangler deploy
```

部署成功后会显示：
```
Published lingzhi-note-fetch (1.23 sec)
  https://lingzhi-note-fetch.workers.dev
```

### 4. 测试 Worker

在浏览器访问：
```
https://lingzhi-note-fetch.workers.dev/fetch?url=https://www.baidu.com
```

应该返回 JSON：
```json
{
  "ok": true,
  "text": "百度网页内容..."
}
```

## 配置自定义域名（可选）

如果需要自定义域名：

1. 在 `wrangler.toml` 添加：
```toml
[routes]
pattern = "fetch.yourdomain.com/*"
zone_name = "yourdomain.com"
```

2. 重新部署：
```bash
wrangler deploy
```

3. 在 Cloudflare Dashboard 添加 DNS 记录指向 Worker。

## 前端配置

前端已自动配置使用默认 Worker URL：`https://lingzhi-note-fetch.workers.dev`

如需修改 Worker 地址，可在设置页面添加「Cloudflare Worker URL」字段，
或直接在浏览器控制台执行：
```javascript
localStorage.setItem('cf_worker_url', 'https://your-custom-url.workers.dev')
```

## 常见问题

### Q: 部署失败提示「Account ID not found」
A: 确保已执行 `wrangler login` 并成功授权。

### Q: Worker 访问超时
A: Cloudflare 免费版有 CPU 时间限制（10ms），抓取大页面可能超时。
   可考虑升级到付费计划或优化抓取逻辑。

### Q: 国内访问慢
A: Cloudflare 在国内节点较少，可考虑绑定自定义域名并开启中国网络优化。

## 费用说明

- **免费额度**：每天 10 万次请求，足够个人使用
- **超出后**：$0.5/百万次请求
- **无服务器费用**：Worker 本身免费

## 监控

可在 Cloudflare Dashboard → Workers & Pages 查看请求日志和错误统计。
