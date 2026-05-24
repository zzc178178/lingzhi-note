// Vercel Serverless Function — 网页抓取代理
// 部署后自动在 https://你的域名.vercel.app/api/fetch?url=...

export default async function handler(req, res) {
  const url = req.query.url
  if (!url) return res.status(400).json({ ok: false, error: '缺少 url 参数' })

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      return res.status(502).json({ ok: false, error: `HTTP ${response.status}` })
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

    res.json({ ok: true, text })
  } catch (e) {
    res.status(502).json({ ok: false, error: e.message })
  }
}
