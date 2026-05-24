import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import { ThemeContext, useThemeProvider } from './hooks/useTheme'
import './app.scss'

function App({ children }: PropsWithChildren) {
  const themeValue = useThemeProvider()

  useLaunch(() => {
    console.log('灵知笔记 launched.')
  })

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export default App