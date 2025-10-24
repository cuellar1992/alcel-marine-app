/**
 * Header Variants
 * Different professional header styles to choose from
 * Copy the one you prefer to Header.jsx
 */

import Container from '../ui/Container'

/* ============================================
   VARIANT 1: Logo with Subtitle (Current)
   ============================================ */
export function HeaderVariant1() {
  return (
    <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 shadow-2xl sticky top-0 z-50">
      <Container>
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300">
              <img 
                src="/logo.png" 
                alt="Alcel Marine Logo" 
                className="h-10 w-auto object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Alcel Marine
              </h1>
              <p className="text-xs text-gray-400">Marine Solutions</p>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            {/* Navigation */}
          </nav>
        </div>
      </Container>
    </header>
  )
}

/* ============================================
   VARIANT 2: Centered Logo
   ============================================ */
export function HeaderVariant2() {
  return (
    <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 shadow-2xl sticky top-0 z-50">
      <Container>
        <div className="py-4 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl p-3 border border-blue-500/20 shadow-lg shadow-blue-500/10">
              <img 
                src="/logo.png" 
                alt="Alcel Marine Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Alcel Marine
              </h1>
              <p className="text-sm text-gray-400">Professional Marine Solutions</p>
            </div>
          </div>
        </div>
      </Container>
    </header>
  )
}

/* ============================================
   VARIANT 3: Logo Only with Glow
   ============================================ */
export function HeaderVariant3() {
  return (
    <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 shadow-2xl sticky top-0 z-50">
      <Container>
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative bg-gray-800 rounded-lg p-2 border border-gray-700">
                <img 
                  src="/logo.png" 
                  alt="Alcel Marine Logo" 
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Alcel <span className="text-cyan-400">Marine</span>
            </h1>
          </div>
          <nav className="flex items-center gap-6">
            {/* Navigation */}
          </nav>
        </div>
      </Container>
    </header>
  )
}

/* ============================================
   VARIANT 4: Compact with Navigation
   ============================================ */
export function HeaderVariant4() {
  return (
    <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 shadow-2xl sticky top-0 z-50">
      <Container>
        <div className="py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg p-1.5">
              <img 
                src="/logo.png" 
                alt="Alcel Marine Logo" 
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </div>
            <span className="text-lg font-bold text-white hidden sm:inline">Alcel Marine</span>
          </div>
          
          <nav className="flex items-center gap-4 text-sm">
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Home</a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Services</a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">About</a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact</a>
          </nav>
        </div>
      </Container>
    </header>
  )
}

/* ============================================
   VARIANT 5: Premium with Border Accent
   ============================================ */
export function HeaderVariant5() {
  return (
    <header className="bg-gray-800/50 backdrop-blur-lg border-b-2 border-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 shadow-2xl sticky top-0 z-50">
      <Container>
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl blur-sm opacity-30"></div>
              <div className="relative bg-gray-900 rounded-xl p-3 border border-gray-700/50">
                <img 
                  src="/logo.png" 
                  alt="Alcel Marine Logo" 
                  className="h-11 w-auto object-contain"
                />
              </div>
            </div>
            <div className="border-l border-gray-700 pl-4 hidden md:block">
              <h1 className="text-xl font-bold text-white">Alcel Marine</h1>
              <p className="text-xs text-cyan-400">Excellence in Marine Solutions</p>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            {/* Navigation */}
          </nav>
        </div>
      </Container>
    </header>
  )
}

