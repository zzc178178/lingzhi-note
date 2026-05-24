import { Link } from 'react-router-dom';
import { getVersionInfo } from '../components/VersionNotice';
import './About.scss';

export function AboutPage() {
  const { version, buildTime, updateHistory } = getVersionInfo();

  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-header">
          <Link to="/" className="back-btn">← 返回</Link>
          <h1>关于灵知笔记</h1>
        </div>

        <div className="about-content">
          <div className="app-logo-section">
            <img src="/logo.svg" alt="灵知笔记" className="app-logo" />
            <h2>灵知笔记</h2>
            <p className="version-text">v{version}</p>
            <p className="build-time">构建时间：{new Date(buildTime).toLocaleString('zh-CN')}</p>
          </div>

          <div className="app-description">
            <h3>产品简介</h3>
            <p>
              灵知笔记是一款基于 AI 的智能笔记工具，支持网页抓取、文章解析、可视化图解等功能，
              帮助您快速整理和理解内容。
            </p>
          </div>

          <div className="update-history">
            <h3>更新历史</h3>
            <ul className="history-list">
              {Object.entries(updateHistory).reverse().map(([ver, desc]) => (
                <li key={ver} className="history-item">
                  <span className="history-version">v{ver}</span>
                  <span className="history-desc">{desc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="tech-info">
            <h3>技术栈</h3>
            <div className="tech-list">
              <span className="tech-tag">React</span>
              <span className="tech-tag">Vite</span>
              <span className="tech-tag">TypeScript</span>
              <span className="tech-tag">Netlify</span>
              <span className="tech-tag">PWA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
