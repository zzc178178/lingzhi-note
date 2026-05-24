// Cloudflare Worker — 网页抓取代理（轻量版）
// 访问: https://lingzhi-note-fetch.workers.dev/fetch?url=xxx

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    
    // 健康检查端点
    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        time: new Date().toISOString(),
        usage: 'GET /fetch?url=xxx'
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const targetUrl = url.searchParams.get('url')

    if (!targetUrl) {
      return new Response(JSON.stringify({ ok: false, error: '缺少 url 参数' }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    }

    try {
      // 使用 fetch API 抓取（Cloudflare 自动处理压缩）
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
        },
        redirect: 'follow'
      })

      if (!response.ok) {
        return new Response(JSON.stringify({ ok: false, error: `HTTP ${response.status}` }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        })
      }

      const html = await response.text()

      // 提取正文内容
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i) || [null, html]
      let text = bodyMatch[1] || html
      
      // 清理 HTML 标签
      text = text
        .replace(/<(script|style|nav|footer|header|aside|noscript)[^>]*>[\s\S]*?<\/\1>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z]+;|&#\d+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 50000) // 限制长度

      return new Response(JSON.stringify({ ok: true, text, length: text.length }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json', 
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300'
        }
      })

    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: e.message || '抓取失败' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    }
  }
}
