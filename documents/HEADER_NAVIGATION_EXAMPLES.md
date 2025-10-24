# 🧭 Header Navigation Examples

## How to Add Navigation to Your Header

You now have reusable Navigation components ready to use!

---

## 📦 Available Navigation Components

### 1. Navigation (Basic)
Simple horizontal navigation links with hover effects

### 2. MobileNavigation
Hamburger menu for mobile devices

### 3. NavigationWithButton
Navigation + Call-to-action button

---

## 🎯 Example 1: Add Basic Navigation

Update your `src/components/layout/Header.jsx`:

```jsx
import Container from '../ui/Container'
import { Navigation } from '../ui'

export default function Header() {
  return (
    <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 shadow-2xl sticky top-0 z-50">
      <Container>
        <div className="py-3 flex items-center justify-between">
          
          {/* Logo Section */}
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
          
          {/* Navigation */}
          <Navigation />
          
        </div>
      </Container>
    </header>
  )
}
```

---

## 🎯 Example 2: Custom Navigation Items

```jsx
import Container from '../ui/Container'
import { Navigation } from '../ui'

const customNavItems = [
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Fleet', href: '#fleet' },
  { label: 'Maintenance', href: '#maintenance' },
  { label: 'Reports', href: '#reports' },
  { label: 'Settings', href: '#settings' },
]

export default function Header() {
  return (
    <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 shadow-2xl sticky top-0 z-50">
      <Container>
        <div className="py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* ... logo code ... */}
          </div>
          
          {/* Custom Navigation */}
          <Navigation items={customNavItems} />
        </div>
      </Container>
    </header>
  )
}
```

---

## 🎯 Example 3: Navigation with Button

```jsx
import Container from '../ui/Container'
import { NavigationWithButton } from '../ui'

export default function Header() {
  const handleGetStarted = () => {
    console.log('Get Started clicked!')
    // Add your logic here
  }

  return (
    <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 shadow-2xl sticky top-0 z-50">
      <Container>
        <div className="py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* ... logo code ... */}
          </div>
          
          {/* Navigation with Button */}
          <NavigationWithButton 
            buttonText="Request Quote"
            onButtonClick={handleGetStarted}
          />
        </div>
      </Container>
    </header>
  )
}
```

---

## 🎯 Example 4: Mobile-Responsive Navigation

```jsx
import { useState } from 'react'
import Container from '../ui/Container'
import { Navigation, MobileNavigation } from '../ui'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 shadow-2xl sticky top-0 z-50">
      <Container>
        <div className="py-3 flex items-center justify-between">
          
          {/* Logo */}
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
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <Navigation />
          </div>

          {/* Mobile Navigation */}
          <MobileNavigation 
            isOpen={mobileMenuOpen}
            onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
          
        </div>
      </Container>
    </header>
  )
}
```

---

## 🎨 Navigation Features

### ✨ Built-in Effects:
- Smooth color transitions on hover
- Animated underline on hover
- Clean, modern design
- Mobile responsive

### 🎯 Default Navigation Items:
- Home
- Services
- Products
- About
- Contact

### 🔧 Customizable:
- Custom navigation items
- Custom colors
- Custom spacing
- Add icons
- Add badges

---

## 🎨 Styling the Navigation

### Change Navigation Colors

```jsx
// In Navigation.jsx, change this line:
className="text-gray-300 hover:text-cyan-400"

// To your preferred colors:
className="text-gray-300 hover:text-blue-400"
className="text-gray-300 hover:text-purple-400"
className="text-white hover:text-cyan-400"
```

### Add Active State

```jsx
<a
  href={item.href}
  className={`text-gray-300 transition-colors duration-200 ${
    isActive ? 'text-cyan-400' : 'hover:text-cyan-400'
  }`}
>
  {item.label}
</a>
```

### Add Icons to Navigation

```jsx
import { Home, Settings, Mail } from 'lucide-react' // or any icon library

const navItems = [
  { label: 'Home', href: '#home', icon: Home },
  { label: 'Settings', href: '#settings', icon: Settings },
  { label: 'Contact', href: '#contact', icon: Mail },
]

// In the navigation render:
<a href={item.href} className="flex items-center gap-2">
  <item.icon size={16} />
  {item.label}
</a>
```

---

## 💡 Quick Tips

1. **Desktop Only**: Use `hidden md:block` on Navigation
2. **Mobile Only**: Use `md:hidden` on MobileNavigation
3. **Responsive**: Combine both for full responsiveness
4. **Custom Items**: Pass `items` prop with your links
5. **Styling**: Use `className` prop for additional styles

---

## 🚀 Next Steps

1. Choose a navigation style from the examples
2. Copy the code to your Header.jsx
3. Customize the navigation items
4. Test on mobile and desktop
5. Add active states if needed

Your header now has:
✅ Professional logo
✅ Responsive navigation
✅ Mobile menu
✅ Smooth animations
✅ Modern design

Check http://localhost:5174 to see it live! 🎉

