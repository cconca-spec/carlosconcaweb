import createMiddleware from 'next-intl/middleware'
import { routing } from '@/lib/i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Todo menos api, cv (redirect al CV), _next, _vercel y archivos con extensión
  matcher: '/((?!api|cv(?:/|$)|_next|_vercel|.*\\..*).*)',
}
