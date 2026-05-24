// Cloudflare Pages Function — 网页抓取代理
// 部署后可用 https://你的项目.pages.dev/api/fetch?url=...

export async function onRequest(context) {
  const url = context.request.url
  const searchParams = new URL(url).searchParams
  const targetUrl = searchParams.get('url')

  if (!targetUrl) {
    return new Response(JSON.stringify({ ok: false, error: '缺少 url 参数' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      return new Response(JSON.stringify({ ok: false, error: `HTTP ${response.status}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
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

    return new Response(JSON.stringify({ ok: true, text }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }
}
