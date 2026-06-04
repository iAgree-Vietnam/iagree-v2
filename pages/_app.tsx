import { AuthProvider } from '@/lib/auth-context'
import dynamic from 'next/dynamic'
import withTheme from '../theme'
import { AppProps } from 'next/app'
import 'react-quill/dist/quill.snow.css'
import React from 'react'

// Load Providers dynamically (no SSR) to avoid server-side API call crashes
const Providers = dynamic(() => import('../src/contexts/Providers'), { ssr: false })
const TopProgressBar = dynamic(() => import('@/src/components/TopProgressBar'), { ssr: false })

// Error boundary to catch and report render errors
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error?.message + '\n' + (error?.stack || '').slice(0, 500) }
  }
  componentDidCatch(error: Error, info: any) {
    console.error('[AppErrorBoundary] Render error:', error?.message, error?.stack?.slice(0, 300))
    console.error('[AppErrorBoundary] Component stack:', info?.componentStack?.slice(0, 300))
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, fontFamily: 'monospace', color: 'red' }}>
          <h2>App Render Error (debug)</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{this.state.error}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

function App({ Component, pageProps }: AppProps) {
  return (
    <AppErrorBoundary>
      {withTheme(
        <AuthProvider>
          <Providers nextAuthSession={pageProps?.session}>
            <TopProgressBar />
            <Component {...pageProps} />
          </Providers>
        </AuthProvider>
      )}
    </AppErrorBoundary>
  )
}

export default App
