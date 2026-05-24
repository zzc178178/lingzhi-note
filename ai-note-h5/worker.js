/**
 * Cloudflare Worker - 网页抓取代理
 *
 * 部署：Cloudflare Dashboard → Workers & Pages → 创建 Worker → 粘贴此代码 → 部署
 * 用法：https://你的worker名.子域名.workers.dev/fetch?url=https://...
 */

export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname !== '/fetch') {
      return new Response('用法: /fetch?url=https://...', { status: 400 })
    }

    const targetUrl = url.searchParams.get('url')
    if (!targetUrl) {
      return Response.json({ ok: false, error: '缺少 url 参数' }, { status: 400 })
    }

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'zh-CN,zh;q=0.9',
        }
      })

      if (!response.ok) {
        return Response.json({ ok: false, error: `HTTP ${response.status}` })
      }

      const html = await response.text()

      // 提取正文
      let body = html.match(/id="js_content"[^>]*>(.*?)<\/div>\s*<script/is)
        || html.match(/class="rich_media_content[^"]*"[^>]*>(.*?)<\/div>/is)
        || html.match(/<(?:article|main)[^>]*>(.*?)<\/(?:article|main)>/is)
        || html.match(/<body[^>]*>(.*?)<\/body>/is)

      let text = (body ? body[1] : html)
        .replace(/<(script|style|nav|footer|header|aside|noscript|iframe|svg)[^>]*>[\s\S]*?<\/\1>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z]+;|&#\d+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      return Response.json({ ok: true, text: text })
    } catch (e) {
      return Response.json({ ok: false, error: e.message }, { status: 502 })
    }
  }
}
