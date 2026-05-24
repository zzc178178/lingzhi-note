import { useEffect, useState } from 'react';
import './VersionNotice.scss';

const VERSION = (import.meta.env as any).VITE_APP_VERSION || '1.0.0';
const BUILD_TIME = (import.meta.env as any).VITE_APP_BUILD_TIME || new Date().toISOString();
const LAST_SEEN_VERSION_KEY = 'lingzhi-note:last-seen-version';

const UPDATE_HISTORY: Record<string, string> = {
  '1.1.0': '✅ 新增版本更新通知功能，修复 Netlify 抓取问题',
  '1.0.0': '🎉 初始版本发布'
};

export function VersionNotice() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const lastSeen = localStorage.getItem(LAST_SEEN_VERSION_KEY);
    
    if (lastSeen !== VERSION) {
      setShowNotice(true);
      localStorage.setItem(LAST_SEEN_VERSION_KEY, VERSION);
    }
  }, []);

  const handleClose = () => {
    setShowNotice(false);
  };

  return (
    <div className={`version-notice ${showNotice ? 'show' : ''}`}>
      <div className="version-notice-content">
        <div className="version-badge">v{VERSION}</div>
        <p className="version-update-text">
          {UPDATE_HISTORY[VERSION] || '系统已更新'}
        </p>
        <button className="version-close-btn" onClick={handleClose}>
          知道了
        </button>
      </div>
    </div>
  );
}

export function getVersionInfo() {
  return {
    version: VERSION,
    buildTime: BUILD_TIME,
    updateHistory: UPDATE_HISTORY
  };
}
