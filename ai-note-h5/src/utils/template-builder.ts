import { NoteData } from './note-model'

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const TEMPLATE_CSS = `
/* ===== Reset & Base ===== */
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html { font-size:15px; scroll-behavior:smooth; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  background: #f0f2f5;
  color: #1a2332;
  line-height: 1.7;
  min-height: 100vh;
  padding: 0;
}

/* ===== Container ===== */
.container {
  max-width: 860px;
  margin: 0 auto;
  padding: 20px 16px 90px;
}

/* ===== Fixed Tab Bottom Bar ===== */
.tab-bar-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0 16px 12px;
  background: linear-gradient(to top, #f0f2f5 70%, transparent);
  pointer-events: none;
  transform: translateY(0);
  transition: transform 0.35s cubic-bezier(.4,0,.2,1);
}
.tab-bar-fixed.tab-hidden {
  transform: translateY(100%);
}
.tab-bar-fixed .tab-nav {
  max-width: 860px;
  margin: 0 auto;
  pointer-events: auto;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.08), 0 2px 12px rgba(0,0,0,0.04);
}

/* ===== Header ===== */
.note-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 16px;
  color: #fff;
  position: relative;
  overflow: hidden;
}
.note-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: rgba(255,255,255,0.08);
  border-radius: 50%;
}
.note-header::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 200px;
  height: 200px;
  background: rgba(255,255,255,0.05);
  border-radius: 50%;
}
.note-tag {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  padding: 3px 10px;
  border-radius: 16px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  border: 1px solid rgba(255,255,255,0.15);
}
.note-header h1 {
  font-size: 1.4rem;
  font-weight: 700;
  position: relative;
  z-index: 1;
  line-height: 1.3;
}
.note-header .subtitle {
  font-size: 0.85rem;
  opacity: 0.85;
  margin-top: 4px;
  position: relative;
  z-index: 1;
  font-weight: 400;
}
/* note-author removed — only note-source is used */

/* ===== Source Link ===== */
.note-source {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
}
.source-label {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.5);
  white-space: nowrap;
}
.source-link {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,0.25);
  padding-bottom: 1px;
  transition: border-color 0.2s;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
.source-link:hover {
  border-bottom-color: rgba(255,255,255,0.7);
  color: #fff;
}

/* ===== Tab Navigation ===== */
.tab-nav {
  display: flex;
  gap: 0;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border: 1px solid #eef0f4;
}
.tab-btn {
  flex: 1;
  padding: 14px 20px;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  font-weight: 600;
  color: #8896ab;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-family: inherit;
}
/* ===== FAB Copy Button ===== */
.fab-copy {
  position: fixed;
  right: 20px;
  bottom: 90px;
  z-index: 101;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 1.3rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(102,126,234,0.4);
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.fab-copy:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(102,126,234,0.5);
}
.fab-copy:active {
  transform: scale(0.95);
}
.fab-copy.success {
  background: linear-gradient(135deg, #34d399 0%, #059669 100%);
  box-shadow: 0 4px 16px rgba(52,211,153,0.4);
}
.tab-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px 3px 0 0;
  transition: width 0.3s ease;
}
.tab-btn:hover {
  color: #4a5a72;
  background: #f8f9fb;
}
.tab-btn.active {
  color: #667eea;
}
.tab-btn.active::after {
  width: 60%;
}
.tab-btn .icon { margin-right: 6px; }

/* ===== Tab Content ===== */
.tab-content { display: none; }
.tab-content.active { display: block; animation: fadeIn 0.35s ease; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ===== Text Tab ===== */
.text-tab { }

/* ===== Cards ===== */
.card {
  background: #fff;
  border-radius: 16px;
  padding: 24px 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border: 1px solid #eef0f4;
  transition: box-shadow 0.2s;
}

/* ===== Content Styles ===== */
.text-content h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a2332;
  margin: 24px 0 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f2f5;
  display: flex;
  align-items: center;
  gap: 8px;
}
.text-content h2:first-child { margin-top: 0; }
.text-content h3 {
  font-size: 1.05rem;
  font-weight: 600;
  color: #2d3e5c;
  margin: 16px 0 8px;
}
.text-content p {
  margin-bottom: 10px;
  color: #3a4a62;
  line-height: 1.8;
}
.text-content ul, .text-content ol {
  margin: 8px 0 12px 20px;
  color: #3a4a62;
}
.text-content li { margin-bottom: 6px; }
.text-content strong { color: #1a2332; }

/* ===== Highlight Tags ===== */
.tag-blue { background:#e8f0fe; color:#1a5fb4; padding:2px 10px; border-radius:8px; font-size:0.8rem; font-weight:600; }
.tag-green { background:#e6f7ed; color:#1a8c4a; padding:2px 10px; border-radius:8px; font-size:0.8rem; font-weight:600; }
.tag-orange { background:#fef4e8; color:#b45a1a; padding:2px 10px; border-radius:8px; font-size:0.8rem; font-weight:600; }
.tag-purple { background:#f0ebff; color:#6b3fa0; padding:2px 10px; border-radius:8px; font-size:0.8rem; font-weight:600; }
.tag-red { background:#fee8e8; color:#b41a1a; padding:2px 10px; border-radius:8px; font-size:0.8rem; font-weight:600; }

/* ===== Highlight Box ===== */
.highlight-box {
  background: #f0f4fe;
  border-left: 4px solid #667eea;
  padding: 14px 18px;
  border-radius: 0 12px 12px 0;
  margin: 12px 0;
}
.highlight-box.warn { background: #fef4e8; border-left-color: #f59e0b; }
.highlight-box.success { background: #e6f7ed; border-left-color: #22c55e; }
.highlight-box.info { background: #eef2ff; border-left-color: #6366f1; }

/* ===== Quote ===== */
blockquote {
  background: #f8f9fb;
  border-left: 3px solid #d0d5dd;
  padding: 10px 16px;
  margin: 12px 0;
  border-radius: 0 8px 8px 0;
  color: #5a6a7e;
  font-style: italic;
}

/* ===== Text Tab Cards REMOVED — 文字页签无卡片，一切归文字 ===== */

/* ===== Code ===== */
code {
  background: #f0f2f5;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.85em;
  font-family: 'JetBrains Mono', 'SF Mono', monospace;
  color: #e74c3c;
}
pre {
  background: #1a2332;
  border-radius: 12px;
  padding: 16px 20px;
  margin: 12px 0;
  overflow-x: auto;
}
pre code {
  background: transparent;
  color: #e8e8e8;
  padding: 0;
  font-size: 0.85rem;
}

/* ===== Table ===== */
.table-wrap {
  overflow-x: auto;
  margin: 12px 0;
}
table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
  font-size: 0.9rem;
}
th {
  background: #f0f4fe;
  color: #1a2332;
  font-weight: 600;
  padding: 10px 14px;
  text-align: left;
  border-bottom: 2px solid #dce3f0;
}
td {
  padding: 10px 14px;
  border-bottom: 1px solid #eef0f4;
  color: #3a4a62;
}
tr:last-child td { border-bottom: none; }
tr:hover td { background: #f8f9fb; }

/* ===== Footer Tags ===== */
.footer-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #eef0f4;
}

/* ===== DIAGRAM TAB ===== */
.diagram-tab { }

.diagram-section {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  border: 1px solid #eef0f4;
}
.diagram-section h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a2332;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.diagram-section .diagram-desc {
  font-size: 0.85rem;
  color: #5a6a7e;
  margin-bottom: 16px;
}
.diagram-section .mermaid {
  text-align: center;
  margin: 12px 0;
}
.diagram-section .mermaid svg {
  max-width: 100%;
}
.mermaid-save-hint {
  text-align: center;
  font-size: 0.75rem;
  color: #a0aec0;
  margin-top: 4px;
}

/* ===== CSS Tree (复用树形结构：选型/分类/层级) ===== */
.tree-wrap {
  font-size: 0.9rem;
  line-height: 1.7;
  padding: 8px 0;
}
.tree-wrap ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.tree-wrap li {
  position: relative;
  padding: 3px 0 3px 28px;
  margin: 0;
}
.tree-wrap > ul > li {
  padding-left: 0;
}
.tree-wrap > ul > li > .node-root {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  padding: 6px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  display: inline-block;
  margin-bottom: 6px;
}
.tree-wrap ul ul {
  position: relative;
  margin-left: 14px;
  border-left: 2px solid #d0d5e0;
}
.tree-wrap ul ul li::before {
  content: '';
  position: absolute;
  left: -2px;
  top: 12px;
  width: 20px;
  height: 0;
  border-top: 2px solid #d0d5e0;
}
.tree-wrap ul ul li:last-child::after {
  content: '';
  position: absolute;
  left: -2px;
  top: 12px;
  bottom: 0;
  width: 2px;
  background: #f0f2f5;
}
.node-label {
  background: #f0f4fe;
  color: #1a5fb4;
  padding: 2px 12px;
  border-radius: 6px;
  display: inline-block;
  font-weight: 500;
  font-size: 0.88rem;
}
.node-label .arrow {
  color: #a0aec0;
  margin: 0 4px;
  font-weight: 300;
}
.node-label .tree-tag {
  font-size: 0.75rem;
  padding: 1px 8px;
  border-radius: 4px;
  margin-left: 4px;
  font-weight: 600;
}
.node-leaf {
  background: #f0fff4;
  color: #276749;
  padding: 2px 12px;
  border-radius: 6px;
  display: inline-block;
  font-weight: 500;
  font-size: 0.88rem;
}
.node-leaf .tree-tag {
  font-size: 0.75rem;
  padding: 1px 8px;
  border-radius: 4px;
  margin-left: 4px;
  font-weight: 600;
}

/* ===== 模式②③④：多列网格卡片 ===== */
.diagram-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-top: 8px;
}
.diagram-grid-4 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px;
  margin-top: 8px;
}
.diagram-grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 8px;
}
.grid-card {
  background: #f8f9fb;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #eef0f4;
}
.grid-card-icon { text-align: center; border-width: 2px; }
.grid-card-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #667eea;
  margin-bottom: 4px;
}
.grid-card-emoji { font-size: 1.8rem; margin: 4px 0; }
.grid-card-title { font-weight: 700; font-size: 1rem; color: #1a2332; margin: 6px 0 4px; }
.grid-card-sub { font-size: 0.8rem; color: #4a5a72; margin: 4px 0; }
.grid-card-desc { font-size: 0.85rem; color: #4a5a72; line-height: 1.6; }

/* ===== 模式④：纵向步骤卡片（带序号圆形） ===== */
.step-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}
.step-item {
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 12px;
  padding: 14px 18px;
  border: 1px solid;
}
.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}
.step-content { flex: 1; }
.step-title { font-weight: 700; color: #1a2332; font-size: 0.95rem; }
.step-tag { font-size: 0.75rem; font-weight: 600; margin-left: 6px; }
.step-desc { font-size: 0.85rem; color: #4a5a72; margin-top: 2px; }

/* ===== 模式⑥：两列标签卡片 ===== */
.tag-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 8px;
}
.tag-card {
  background: #f8f9fb;
  border-radius: 12px;
  padding: 14px 16px;
  border: 1px solid #eef0f4;
}
.tag-card-title { font-weight: 700; font-size: 0.95rem; color: #1a2332; margin-bottom: 6px; }
.tag-group { display: flex; gap: 6px; flex-wrap: wrap; }
.tag-pill {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
}

/* ===== 效果/信息条 ===== */
.effect-bar {
  margin-top: 12px;
  padding: 10px 14px;
  background: #e6f7ed;
  border-radius: 10px;
  font-size: 0.85rem;
  color: #1a8c4a;
}
.info-bar {
  margin-top: 12px;
  padding: 10px 14px;
  background: #f8f9fb;
  border-radius: 10px;
  border: 1px solid #eef0f4;
  font-size: 0.85rem;
  color: #4a5a72;
}
.bar-sep { color: #d0d5dd; margin: 0 6px; }

/* ===== Diagram Cards ===== */
.diagram-card {
  border-radius: 12px;
  padding: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.diagram-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
}

/* ===== CSS Flow Nodes ===== */
.css-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin: 16px 0;
}
.css-flow-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}
.css-node {
  padding: 8px 18px;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  transition: transform 0.15s;
}
.css-node:hover { transform: scale(1.03); }
.css-node.blue { background:#e8f0fe; border:2px solid #667eea; color:#1a5fb4; }
.css-node.green { background:#e6f7ed; border:2px solid #22c55e; color:#1a8c4a; }
.css-node.orange { background:#fef4e8; border:2px solid #f59e0b; color:#b45a1a; }
.css-node.purple { background:#f0ebff; border:2px solid #7c3aed; color:#6b3fa0; }
.css-node.pink { background:#fdf2f8; border:2px solid #ec4899; color:#b91c6e; }
.css-arrow { font-size:1.3rem; color:#a0aec0; font-weight:300; }

/* ===== Timeline ===== */
.timeline {
  position: relative;
  padding: 12px 0;
  margin: 12px 0;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 18px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e4ec;
}
.timeline-item {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  position: relative;
}
.timeline-marker {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  z-index: 1;
}
.timeline-content {
  flex: 1;
  background: #f8f9fb;
  border-radius: 12px;
  padding: 14px 18px;
}
.timeline-content .tl-title { font-weight:600; color:#1a2332; margin-bottom:4px; }
.timeline-content .tl-desc { font-size:0.85rem; color:#4a5a72; }

/* ===== My Note Tab ===== */
.mynote-tab .card { padding:0; overflow:hidden; }
.mynote-header {
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:14px 20px;
  border-bottom:1px solid #eef0f4;
  font-size:0.85rem;
  color:#5a6a7e;
}
.mynote-header span:first-child{font-weight:600;color:#1a2332;font-size:0.95rem}
.mynote-hint{font-size:0.78rem;color:#a0aec0}
.mynote-editor{
  padding:20px 24px;
  min-height:300px;
  line-height:1.8;
  color:#1a2332;
  font-size:0.95rem;
  outline:none;
  transition:background 0.15s;
}
.mynote-editor:focus{background:#fafbfc}
.mynote-editor:empty::before{
  content:'在这里写下你的总结或想法…';
  color:#c0c8d8;
  font-style:italic;
}
.mynote-editor h1,.mynote-editor h2,.mynote-editor h3{margin:12px 0 6px;font-weight:600;color:#1a2332}
.mynote-editor h1{font-size:1.3rem}
.mynote-editor h2{font-size:1.15rem}
.mynote-editor h3{font-size:1.05rem}
.mynote-editor p{margin-bottom:6px}
.mynote-editor ul,.mynote-editor ol{padding-left:20px;margin:4px 0}
.mynote-editor code{
  background:#f0f2f5;
  padding:1px 6px;
  border-radius:4px;
  font-size:0.85em;
  font-family:monospace;
  color:#e74c3c;
}
.mynote-editor blockquote{
  border-left:3px solid #667eea;
  padding:6px 14px;
  margin:8px 0;
  background:#f8f9fb;
  border-radius:0 6px 6px 0;
  color:#4a5a72;
}

/* ===== Responsive ===== */
@media (max-width: 640px) {
  .container { padding: 12px 10px 30px; }
  .note-header { padding: 24px 18px; }
  .note-header h1 { font-size: 1.4rem; }
  .card { padding: 18px 16px; }
  .concept-grid { grid-template-columns: 1fr; }
  .tab-btn { font-size: 0.85rem; padding: 12px 10px; }
  .css-node { font-size: 0.75rem; padding: 6px 12px; white-space: normal; }
  .diagram-section { padding: 18px 16px; }
  /* Grid layouts keep columns but shrink */
  .diagram-grid-3 { gap: 6px; }
  .diagram-grid-3 .grid-card { padding: 10px; }
  .diagram-grid-3 .grid-card-emoji { font-size: 1.3rem; }
  .diagram-grid-3 .grid-card-title { font-size: 0.85rem; }
  .diagram-grid-3 .grid-card-sub { font-size: 0.72rem; }
  .diagram-grid-3 .grid-card-desc { font-size: 0.75rem; }
  .diagram-grid-4 { gap: 5px; }
  .diagram-grid-4 .grid-card { padding: 8px; }
  .diagram-grid-4 .grid-card-emoji { font-size: 1.1rem; }
  .diagram-grid-4 .grid-card-title { font-size: 0.8rem; }
  .diagram-grid-4 .grid-card-sub { font-size: 0.7rem; }
  .diagram-grid-4 .grid-card-desc { font-size: 0.7rem; }
  .diagram-grid-auto { gap: 5px; }
  .diagram-grid-auto .grid-card { padding: 8px; }
  .diagram-grid-auto .grid-card-emoji { font-size: 1.1rem; }
  .diagram-grid-auto .grid-card-title { font-size: 0.8rem; }
  .diagram-grid-auto .grid-card-desc { font-size: 0.7rem; }
  .tag-grid-2 { gap: 6px; }
  /* Mermaid diagrams scroll horizontally if too wide */
  .diagram-section .mermaid { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .diagram-section .mermaid svg { min-width: 320px; }
  /* Step items stack vertically on very narrow screens */
  .step-item { flex-direction: column; align-items: flex-start; gap: 8px; }
  /* Timeline tighter */
  .timeline-item { gap: 10px; }
  .timeline-marker { width: 30px; height: 30px; font-size: 0.7rem; }
  /* CSS flow wraps nicely */
  .css-flow-row { gap: 6px; }
}
@media (max-width: 380px) {
  .tab-btn { font-size: 0.78rem; padding: 10px 6px; }
  .tab-btn .icon { display: none; }
  .fab-copy { width: 42px; height: 42px; right: 14px; bottom: 80px; font-size: 1.1rem; }
}
`;

const THEME_OVERRIDE = `/* --- Warm Paper Theme Override --- */
:root { --bg:#f5f4f0; --surface:#fefdfb; --ink:#1c1917; --accent:#b7612e; --accent-glow:#f0ece8; --border:#e7e0d5; }
html, body { min-height:0px !important; }
.tab-content { min-height:0px !important; }
body { background:#f5f4f0; }
.container { padding-bottom:56px; }
.container { background:transparent; }
.note-header { background:linear-gradient(160deg, #2c1810 0%, #4a2c17 60%, #5a3a22 100%); }
.note-header::before { opacity:0.5; }
.note-tag { background:rgba(183,97,46,.25); color:#f0d5b8; }
h1 { color:#fffef9; }
.note-header .subtitle { color:rgba(255,255,255,.7); }
.note-source a, .note-source .source-link { color:#f0d5b8; }
.source-label { color:rgba(255,255,255,.5); }
.tab-bar-fixed { background:rgba(245,245,247,.94); border-top:1px solid #e7e0d5; }
.tab-nav { background:#fafafb; border-color:#e7e0d5; }
.tab-btn { color:#8c8580; }
.tab-btn:hover { color:#5a4030; }
.tab-btn.active { color:#b7612e; }
.tab-btn.active::after { background:linear-gradient(90deg, #b7612e, #8b5e3c); }
.fab-copy { background:linear-gradient(135deg, #b7612e 0%, #8b5e3c 100%); box-shadow:0 4px 16px rgba(183,97,46,.4); }
.fab-copy:hover { box-shadow:0 6px 24px rgba(183,97,46,.5); }
.fab-copy.success { background:linear-gradient(135deg, #5b7f5e 0%, #3d5a3e 100%); box-shadow:0 4px 16px rgba(91,127,94,.4); }
.card { background:#fafafb; border-color:#e7e0d5; }
.text-content h2 { color:#2c1f12; border-bottom-color:#e7e0d5; }
.text-content h3 { color:#3d2e1c; }
.highlight-box { border-left-color:#b7612e; background:#f4f3f4; color:#5a3a22; }
.highlight-box.highlight-blue { border-left-color:#b7612e; background:#f4f3f4; }
.highlight-box.highlight-green { border-left-color:#5b7f5e; background:#eef5ef; color:#3d5a3e; }
.highlight-box.highlight-orange { border-left-color:#d4874a; background:#f5f4f5; color:#5a3a22; }
blockquote { background:#f5f5f6; border-left-color:#d4c9b8; color:#5a4a3a; }
pre, pre code { background:#2c1f12; color:#f2e4d4; }
table th { background:#4a2c17; color:#fffef9; }
.grid-card { background:#f5f5f6; border-color:#e7e0d5; }
.grid-card-label { color:#b7612e; }
.grid-card-title { color:#2c1f12; }
.grid-card-desc { color:#5a4a3a; }
.step-item { border-color:#e7e0d5; }
.step-desc { color:#5a4a3a; }
.css-node.blue { background:#f4f4f5; border-color:#b7612e; color:#8b5e3c; }
.css-node.green { background:#eef5ef; border-color:#5b7f5e; color:#3d5a3e; }
.css-node.orange { background:#f5f4f5; border-color:#d4874a; color:#8b5a2e; }
.css-arrow { color:#b7612e; }
.tag-card { background:#f5f5f6; border-color:#e7e0d5; }
.tag-card-title { color:#2c1f12; }
.tag-pill.tag-blue, .tag-blue { background:#f4f3f4; color:#b7612e; }
.tag-pill.tag-purple, .tag-purple { background:#f3edf7; color:#8b5e3c; }
.tag-pill.tag-green, .tag-green { background:#eef5ef; color:#5b7f5e; }
.tag-pill.tag-orange, .tag-orange { background:#f5f4f5; color:#d4874a; }
.effect-bar { background:#eef5ef; color:#3d5a3e; }
.info-bar { background:#f5f5f6; border-color:#e7e0d5; color:#5a4a3a; }
.bar-sep { color:#d4c9b8; }
.node-root { background:linear-gradient(135deg, #b7612e, #8b5e3c); color:#fff; }
.node-label { background:#f4f4f5; color:#8b5e3c; }
.node-leaf { background:#eef5ef; color:#3d5a3e; }
.tree-wrap ul ul { border-left-color:#d4c9b8; }
.tree-wrap ul ul li::before { border-top-color:#d4c9b8; }
.footer-tags { border-top-color:#e7e0d5; }
.footer-tag.tag-blue { background:#f4f3f4; color:#b7612e; }
.footer-tag.tag-purple { background:#f3edf7; color:#8b5e3c; }
.footer-tag.tag-green { background:#eef5ef; color:#5b7f5e; }
.footer-tag.tag-orange { background:#f5f4f5; color:#d4874a; }
.mermaid { background:#f5f5f6; border-color:#e7e0d5; color:#5a4a3a; }
.mynote-editor { color:#2c1f12; }
a, .note-source a, .note-source a:visited { color:#b7612e; }
`;

export function buildNoteHtml(note: NoteData): string {
  const title = esc(note.title)
  const subtitle = esc(note.subtitle)
  const tag = esc(note.tag)
  const sourceLink = note.source
    ? `<span class="source-label">来源</span><a class="source-link" href="${esc(note.source)}" target="_blank" rel="noopener">${esc(note.source)}</a>`
    : ''
  const userNotes = esc(note.userNotes || '')

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>${title} - 灵知笔记</title>
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"><\/script>
<style>
${TEMPLATE_CSS}
${THEME_OVERRIDE}
</style>
</head>
<body>
<div class="container">
  <div class="note-header">
    <span class="note-tag">${tag}</span>
    <h1>${title}</h1>
    <div class="subtitle">${subtitle}</div>
    ${sourceLink ? `<div class="note-source">${sourceLink}</div>` : ''}
  </div>

  <div class="tab-bar-fixed">
    <div class="tab-nav">
      <button class="tab-btn active" data-tab="text" aria-selected="true"><span class="tab-icon">📝</span>文字</button>
      <button class="tab-btn" data-tab="diagram" aria-selected="false"><span class="tab-icon">🎨</span>图解</button>
      <button class="tab-btn" data-tab="mynote" aria-selected="false"><span class="tab-icon">✏️</span>随手记</button>
    </div>
  </div>

  <div class="tab-content text-tab active" id="tab-text">
    <div class="card">
      <div class="text-content">
        ${note.textContent}
      </div>
    </div>
  </div>

  <div class="tab-content diagram-tab" id="tab-diagram">
    ${note.diagramContent}
  </div>

  <div class="tab-content mynote-tab" id="tab-mynote">
    <div class="card">
      <div class="mynote-editor" contenteditable="true" spellcheck="true">${userNotes}</div>
    </div>
  </div>

  <button class="fab-copy" title="智能复制" onclick="smartCopy()">📋</button>
</div>
<script>
var __noteId__ = '${note.id}';

mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  theme: 'base',
  themeVariables: {
    primaryColor: '#eef2ff',
    primaryTextColor: '#1a2332',
    primaryBorderColor: '#667eea',
    lineColor: '#a0aec0',
    secondaryColor: '#f8f9fb',
    tertiaryColor: '#ffffff',
    fontSize: '14px'
  },
  flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' }
});

function renderDiagrams() {
  document.querySelectorAll('#tab-diagram .mermaid').forEach((el, idx) => {
    if (el.querySelector('svg')) return;
    const code = el.textContent.trim();
    el.setAttribute('data-mermaid-source', code);
    const id = 'mermaid-' + Date.now() + '-' + idx;
    const retryCount = parseInt(el.dataset.retry || '0');
    mermaid.render(id, code).then(({ svg }) => {
      el.innerHTML = svg;
      // Add save hint below Mermaid SVG
      const hint = document.createElement('div');
      hint.className = 'mermaid-save-hint';
      hint.textContent = '💡 长按图片可保存';
      el.parentNode.insertBefore(hint, el.nextSibling);
    }).catch(err => {
      console.error('Mermaid render error (attempt ' + (retryCount + 1) + '):', err);
      if (retryCount < 1) {
        // 自动重试一次（避免临时性加载失败）
        el.dataset.retry = '1';
        setTimeout(() => renderDiagrams(), 500);
      } else {
        el.innerHTML = '<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px;text-align:center;color:#dc2626;font-size:0.9rem;">⚠️ 图表渲染失败</div>';
      }
    });
  });
}

// ===== Scroll-to-hide Tab Bar =====
(function(){
  const bar = document.querySelector('.tab-bar-fixed');
  if(!bar) return;
  let lastY = window.scrollY, ticking = false;
  window.addEventListener('scroll', function(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      const y = window.scrollY;
      if(y > lastY && y > 60) bar.classList.add('tab-hidden');
      else bar.classList.remove('tab-hidden');
      lastY = y;
      ticking = false;
    });
  }, {passive:true});
})();

// Tab switching
function updateFabIcon(){
  const fab = document.querySelector('.fab-copy');
  if(!fab) return;
  fab.textContent = '📋';
  fab.title = '复制为文字';
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    this.setAttribute('aria-selected','true');
    const tabId = this.getAttribute('data-tab');
    document.getElementById('tab-' + tabId).classList.add('active');

    if (tabId === 'diagram') {
      setTimeout(renderDiagrams, 150);
    }
    if (tabId === 'mynote') {
      loadMyNote();
    }
    updateFabIcon();
  });
});

// ===== Smart Copy =====
function getActiveTab(){
  const btn = document.querySelector('.tab-btn.active');
  return btn ? btn.getAttribute('data-tab') : 'text';
}

function fabSuccess(){
  const fab = document.querySelector('.fab-copy');
  if(!fab) return;
  fab.classList.add('success');
  fab.textContent = '✅';
  setTimeout(() => { fab.classList.remove('success'); updateFabIcon(); }, 1500);
}

function smartCopy(){
  const tab = getActiveTab();
  if(tab === 'diagram') return copyDiagramText();
  return copyAsMarkdown(tab);
}

function copyAsMarkdown(tab){
  const selector = tab === 'mynote' ? '#tab-mynote .mynote-editor' : '#tab-text .text-content';
  const root = document.querySelector(selector);
  if(!root) return;
  let md = '';
  for(const el of root.children){
    md += htmlToMd(el) + '\\n\\n';
  }
  md = md.trim();
  
  if(!md){
    const plain = root.innerText.trim();
    navigator.clipboard.writeText(plain).then(fabSuccess).catch(() => alert('复制失败'));
    return;
  }
  
  navigator.clipboard.writeText(md).then(fabSuccess).catch(() => {
    const plain = root.innerText.trim();
    navigator.clipboard.writeText(plain).catch(() => alert('复制失败，请手动选中文字复制'));
  });
}

function copyDiagramText(){
  const section = document.querySelector('#tab-diagram');
  if(!section) return;
  // Extract text from all diagram sections
  const parts = [];
  section.querySelectorAll('.diagram-section, .card').forEach(el => {
    const title = el.querySelector('h3');
    const desc = el.querySelector('.diagram-desc');
    if(title) parts.push('## ' + title.textContent.trim());
    if(desc) parts.push(desc.textContent.trim());
    // Extract text from grid cards, step items, tag cards, tree nodes, etc.
    el.querySelectorAll('.grid-card-title, .step-title, .tag-card-title, .node-label, .node-leaf, .tl-title, .tl-desc, .node-root').forEach(n => {
      const t = n.textContent.trim();
      if(t && !parts.includes(t)) parts.push('· ' + t);
    });
    // Mermaid diagram — add source as code block
    el.querySelectorAll('.mermaid').forEach(m => {
      const src = m.getAttribute('data-mermaid-source');
      if(src) parts.push('\`\`\`mermaid\\n' + src + '\\n\`\`\`');
    });
  });
  // If nothing structured found, fallback to innerText
  const text = parts.length > 0 ? parts.join('\\n\\n') : section.innerText.trim();
  if(!text){ alert('图解无可复制内容'); return; }
  navigator.clipboard.writeText(text).then(fabSuccess).catch(() => {
    const plain = section.innerText.trim();
    navigator.clipboard.writeText(plain).catch(() => alert('复制失败，请手动选中文字复制'));
  });
}

function htmlToMd(el){
  const tag = el.tagName.toLowerCase();
  const text = el.textContent.trim();
  if(!text) return '';

  // Headings
  if(tag === 'h2') return '## ' + text;
  if(tag === 'h3') return '### ' + text;
  if(tag === 'h4') return '#### ' + text;

  // Paragraph
  if(tag === 'p') return inlineMd(el);

  // List item — extract text content excluding nested lists
  if(tag === 'li'){
    return Array.from(el.childNodes)
      .filter(n => n.nodeType !== 1 || (n.tagName !== 'UL' && n.tagName !== 'OL'))
      .map(n => {
        if(n.nodeType === 3) return n.textContent.trim();
        if(n.nodeType === 1) return inlineMd(n);
        return '';
      })
      .join('').trim();
  }

  // Unordered list — support nested lists with indentation
  if(tag === 'ul'){
    return Array.from(el.children).map(li => {
      const liText = htmlToMd(li);
      let result = liText ? '- ' + liText : '';
      li.querySelectorAll(':scope > ul, :scope > ol').forEach(nested => {
        const nestedMd = htmlToMd(nested).split('\\n').map(l => '  ' + l).join('\\n');
        result += (result ? '\\n' : '') + nestedMd;
      });
      return result;
    }).join('\\n');
  }

  // Ordered list — support nested lists with indentation
  if(tag === 'ol'){
    return Array.from(el.children).map((li, i) => {
      const liText = htmlToMd(li);
      let result = liText ? (i+1) + '. ' + liText : (i+1) + '.';
      li.querySelectorAll(':scope > ul, :scope > ol').forEach(nested => {
        const nestedMd = htmlToMd(nested).split('\\n').map(l => '  ' + l).join('\\n');
        result += '\\n' + nestedMd;
      });
      return result;
    }).join('\\n');
  }

  // Blockquote
  if(tag === 'blockquote'){
    const inner = inlineMd(el);
    return inner.split('\\n').map(l => '> ' + l).join('\\n');
  }

  // Code block
  if(tag === 'pre'){
    const code = el.querySelector('code');
    return '\`\`\`\\n' + (code ? code.textContent : text) + '\\n\`\`\`';
  }

  // Highlight box — distinguish variants
  if(el.classList && el.classList.contains('highlight-box')){
    let prefix = '> 💡 ';
    if(el.classList.contains('warn')) prefix = '> ⚠️ ';
    if(el.classList.contains('success')) prefix = '> ✅ ';
    if(el.classList.contains('info')) prefix = '> ℹ️ ';
    return prefix + text;
  }

  // Table (direct <table> or wrapped in div)
  const tbl = tag === 'table' ? el : el.querySelector('table');
  if(tbl) return tableToMd(tbl);

  // Tag group / footer
  if(el.classList && el.classList.contains('footer-tags')){
    return Array.from(el.querySelectorAll('span'))
      .map(s => '\`' + s.textContent.trim() + '\`')
      .join(' ');
  }

  // Default: inline
  return inlineMd(el);
}

function inlineMd(el){
  let html = el.innerHTML;
  // Convert <a> to [text](url)
  html = html.replace(/<a\\s[^>]*href="([^"]*)"[^>]*>(.*?)<\\/a>/gi, '[\$2](\$1)');
  // Convert <strong> to **
  html = html.replace(/<strong>(.*?)<\\/strong>/gi, '**\$1**');
  // Convert <em>/<i> to *
  html = html.replace(/<(em|i)>(.*?)<\\/(em|i)>/gi, '*\$2*');
  // Convert <code> to \`
  html = html.replace(/<code>(.*?)<\\/code>/gi, '\`\$1\`');
  // Remove <span> (keep content)
  html = html.replace(/<\\/?span[^>]*>/gi, '');
  // Convert <br> to newline
  html = html.replace(/<br\\s*\\/?>/gi, '\\n');
  // Strip remaining HTML tags
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent.trim();
}

function tableToMd(table){
  const rows = table.querySelectorAll('tr');
  if(!rows.length) return '';
  let md = '';
  // Header
  const headers = rows[0].querySelectorAll('th,td');
  md += '| ' + Array.from(headers).map(h => h.textContent.trim()).join(' | ') + ' |\\n';
  md += '| ' + Array.from(headers).map(() => '---').join(' | ') + ' |\\n';
  // Body
  for(let i = 1; i < rows.length; i++){
    const cells = rows[i].querySelectorAll('td');
    md += '| ' + Array.from(cells).map(c => c.textContent.trim()).join(' | ') + ' |\\n';
  }
  return md;
}

// ===== My Note (persisted to localStorage) =====
const MN_KEY='ai_note_mynote_' + encodeURIComponent('<!-- NOTE_TITLE -->');

function loadMyNote(){
  const editor=document.getElementById('mynoteEditor');
  try{
    const saved=localStorage.getItem(MN_KEY);
    if(saved) editor.innerHTML=saved;
  }catch(e){}
  // Auto-save on input
  editor._saveTimer=null;
  editor.oninput=function(){
    clearTimeout(this._saveTimer);
    this._saveTimer=setTimeout(()=>{
      try{localStorage.setItem(MN_KEY,this.innerHTML)}catch(e){}
    },300);
  };
}

<\/script>
<script>
(function() {
  function reportHeight() {
    var h = document.documentElement.scrollHeight;
    window.parent.postMessage({ type: '灵知笔记-resize', height: h }, '*');
  }
  if (window.ResizeObserver) {
    new ResizeObserver(reportHeight).observe(document.body);
  }
  reportHeight();
  setTimeout(reportHeight, 300);
  setTimeout(reportHeight, 1000);
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      setTimeout(reportHeight, 200);
      setTimeout(reportHeight, 600);
    });
  });
})();
<\/script>
</body>
</html>`;
}

export function downloadNoteAsHtml(note: NoteData): void {
  const html = buildNoteHtml(note)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${note.title || '灵知笔记'}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
