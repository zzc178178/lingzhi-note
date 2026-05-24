// Netlify Serverless Function — 网页抓取代理
// 部署后自动在 https://你的域名.netlify.app/api/fetch?url=...

export default async function handler(event, context) {
  const { url } = event.queryStringParameters
  if (!url) return {
    statusCode: 400,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ ok: false, error: '缺少 url 参数' })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'Upgrade-Insecure-Requests': '1',
        'Referer': 'https://www.google.com/',
      },
      signal: AbortSignal.timeout(20000),
    })

    if (!response.ok) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ ok: false, error: `HTTP ${response.status}` })
      }
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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: true, text })
    }
  } catch (e) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: false, error: e.message })
    }
  }
}
