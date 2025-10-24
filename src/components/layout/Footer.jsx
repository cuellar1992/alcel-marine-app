/**
 * Footer Component
 * Premium application footer
 */

import Container from '../ui/Container'

export default function Footer() {
  return (
    <footer className="mt-auto py-8 border-t border-white/5 bg-gradient-to-r from-slate-950/50 via-gray-900/50 to-slate-950/50 backdrop-blur-xl">
      <Container>
        <div className="text-center">
          <p className="text-gray-400 text-sm font-light tracking-wide">
            Alcel Marine © 2025 • Marine Services Provider
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Excellence in Marine Solutions
          </p>
        </div>
      </Container>
    </footer>
  )
}

