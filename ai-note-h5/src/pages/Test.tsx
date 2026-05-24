import { useState } from 'react';
import './Test.scss';

const TEST_URL = 'https://www.baidu.com';

export function TestPage() {
  const [results, setResults] = useState<{ name: string; status: 'pending' | 'success' | 'failed'; error?: string }[]>([
    { name: 'Netlify Function', status: 'pending' },
    { name: 'allorigins.win', status: 'pending' },
    { name: 'corsproxy.io', status: 'pending' },
    { name: 'allorigins.xyz', status: 'pending' },
    { name: 'thingproxy', status: 'pending' },
    { name: 'codetabs', status: 'pending' },
  ]);

  const testProxy = async (name: string, url: string) => {
    setResults(prev => prev.map(r => r.name === name ? { ...r, status: 'pending' as const } : r));
    
    try {
      const start = Date.now();
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      const time = Date.now() - start;
      
      if (res.ok) {
        const text = await res.text();
        if (text.length > 100) {
          setResults(prev => prev.map(r => r.name === name ? { ...r, status: 'success', error: `成功 (${time}ms)` } : r));
        } else {
          setResults(prev => prev.map(r => r.name === name ? { ...r, status: 'failed', error: `内容过短 (${text.length} chars)` } : r));
        }
      } else {
        setResults(prev => prev.map(r => r.name === name ? { ...r, status: 'failed', error: `HTTP ${res.status}` } : r));
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : '未知错误';
      setResults(prev => prev.map(r => r.name === name ? { ...r, status: 'failed', error: msg } : r));
    }
  };

  const runAllTests = () => {
    const proxies = [
      { name: 'Netlify Function', url: `/api/fetch?url=${encodeURIComponent(TEST_URL)}` },
      { name: 'allorigins.win', url: `https://api.allorigins.win/raw?url=${encodeURIComponent(TEST_URL)}` },
      { name: 'corsproxy.io', url: `https://corsproxy.io/?url=${encodeURIComponent(TEST_URL)}` },
      { name: 'allorigins.xyz', url: `https://api.allorigins.xyz/raw?url=${encodeURIComponent(TEST_URL)}` },
      { name: 'thingproxy', url: `https://thingproxy.freeboard.io/fetch?url=${encodeURIComponent(TEST_URL)}` },
      { name: 'codetabs', url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(TEST_URL)}` },
    ];

    proxies.forEach(({ name, url }) => {
      setTimeout(() => testProxy(name, url), 100);
    });
  };

  return (
    <div className="test-page">
      <div className="test-header">
        <h1>代理测试</h1>
        <p>测试各个代理是否正常工作</p>
      </div>

      <button className="test-btn" onClick={runAllTests}>
        开始测试
      </button>

      <div className="test-results">
        {results.map((result, index) => (
          <div key={index} className={`test-item ${result.status}`}>
            <span className="test-name">{result.name}</span>
            <span className={`test-status ${result.status}`}>
              {result.status === 'pending' && '等待...'}
              {result.status === 'success' && '✓ 成功'}
              {result.status === 'failed' && `✗ 失败`}
            </span>
            {result.error && <span className="test-error">{result.error}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
