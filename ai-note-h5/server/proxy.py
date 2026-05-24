"""
轻量级网页抓取代理 - 绕过 CORS 限制
专门处理微信文章等有反爬保护的链接
启动: python server/proxy.py
端口: 8765
"""

import urllib.request
import urllib.parse
import urllib.error
import json
import re
from http.server import HTTPServer, BaseHTTPRequestHandler

UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

class ProxyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # 解析 /fetch?url=...
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path != '/fetch':
            self.send_error(404)
            return

        params = urllib.parse.parse_qs(parsed.query)
        url = params.get('url', [None])[0]
        if not url:
            self.send_error(400, 'Missing url parameter')
            return

        try:
            req = urllib.request.Request(url, headers={
                'User-Agent': UA,
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Referer': 'https://www.google.com/',
            })
            with urllib.request.urlopen(req, timeout=25) as resp:
                html = resp.read().decode('utf-8', errors='replace')

            # 提取文章正文
            text = self.extract_text(html)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            resp_data = json.dumps({'ok': True, 'text': text}, ensure_ascii=False)
            self.wfile.write(resp_data.encode('utf-8'))

        except urllib.error.HTTPError as e:
            self.send_response(502)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'ok': False, 'error': f'HTTP {e.code}'}, ensure_ascii=False).encode())

        except Exception as e:
            self.send_response(502)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'ok': False, 'error': str(e)}, ensure_ascii=False).encode())

    def extract_text(self, html: str) -> str:
        """从 HTML 提取文章正文"""
        # 优先取微信公众号正文
        m = re.search(r'id="js_content"[^>]*>(.*?)</div>\s*<script', html, re.DOTALL)
        if not m:
            m = re.search(r'class="rich_media_content[^"]*"[^>]*>(.*?)</div>', html, re.DOTALL)
        if not m:
            m = re.search(r'<(?:article|main)[^>]*>(.*?)</(?:article|main)>', html, re.DOTALL)
        if not m:
            m = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)

        body = m.group(1) if m else html

        text = re.sub(r'<(script|style|nav|footer|header|aside|noscript|iframe|svg)[^>]*>.*?</\1>', '', body, flags=re.DOTALL)
        text = re.sub(r'<[^>]+>', ' ', text)
        text = re.sub(r'&[a-z]+;|&#\d+;', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()

        return text

    def log_message(self, format, *args):
        print(f"[proxy] {args[0]}")

if __name__ == '__main__':
    server = HTTPServer(('127.0.0.1', 8765), ProxyHandler)
    print('[proxy] 网页抓取代理已启动 → http://127.0.0.1:8765/fetch?url=...')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()
        print('\n[proxy] 已关闭')
