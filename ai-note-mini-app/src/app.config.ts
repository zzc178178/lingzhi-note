export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/create/create',
    'pages/note/note',
    'pages/notes/notes',
    'pages/settings/settings'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#667eea',
    navigationBarTitleText: 'AI 笔记',
    navigationBarTextStyle: 'white'
  }
})