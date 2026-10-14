import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './i18n.jsx'
import { CmsProvider } from './cms/CmsContext.jsx'
import { AdminApp } from './admin/AdminApp.jsx'

function Root() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  if (path.startsWith('/admin')) {
    return <AdminApp />
  }

  return (
    <LanguageProvider>
      <CmsProvider>
        <App />
      </CmsProvider>
    </LanguageProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
