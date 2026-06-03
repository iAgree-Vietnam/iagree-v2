import { AuthProvider } from '@/lib/auth-context'
import dynamic from 'next/dynamic'
import withTheme from '../theme'
import { AppProps } from 'next/app'
import 'react-quill/dist/quill.snow.css'

// Load Providers dynamically (no SSR) to avoid server-side API call crashes
const Providers = dynamic(() => import('../src/contexts/Providers'), { ssr: false })
const TopProgressBar = dynamic(() => import('@/src/components/TopProgressBar'), { ssr: false })

function App({ Component, pageProps }: AppProps) {
  return withTheme(
    <AuthProvider>
      <Providers nextAuthSession={pageProps?.session}>
        <TopProgressBar />
        <Component {...pageProps} />
      </Providers>
    </AuthProvider>
  )
}

export default App
