# ⚡ Quick Reference Guide

## 📦 Available Components

### UI Components (`src/components/ui/`)

| Component | Purpose | Props |
|-----------|---------|-------|
| `Button` | Clickable button | `variant`, `size`, `onClick`, `disabled` |
| `Card` | Container with glass effect | `variant`, `hover`, `className` |
| `Container` | Responsive wrapper | `size`, `className` |

### Layout Components (`src/components/layout/`)

| Component | Purpose | Props |
|-----------|---------|-------|
| `Layout` | Page wrapper with header/footer | `children` |
| `Header` | App header (sticky) | - |
| `Footer` | App footer | - |

---

## 🎨 Button Variants

```jsx
<Button variant="primary">Primary</Button>    // Blue gradient
<Button variant="secondary">Secondary</Button> // Gray
<Button variant="outline">Outline</Button>     // Border only
<Button variant="ghost">Ghost</Button>         // Transparent
```

## 📏 Button Sizes

```jsx
<Button size="sm">Small</Button>   // Compact
<Button size="md">Medium</Button>  // Default
<Button size="lg">Large</Button>   // Big
```

---

## 🃏 Card Variants

```jsx
<Card variant="default">...</Card>   // Semi-transparent
<Card variant="gradient">...</Card>  // Gradient background
<Card variant="solid">...</Card>     // Solid background
```

---

## 📐 Container Sizes

```jsx
<Container size="sm">...</Container>      // max-w-3xl
<Container size="default">...</Container> // max-w-7xl (default)
<Container size="lg">...</Container>      // max-w-[1400px]
<Container size="full">...</Container>    // max-w-full
```

---

## 🪝 Custom Hooks

### useLocalStorage

Persist state in browser localStorage:

```jsx
import { useLocalStorage } from './hooks'

function MyComponent() {
  const [name, setName] = useLocalStorage('userName', 'Guest')
  
  return (
    <input 
      value={name} 
      onChange={(e) => setName(e.target.value)} 
    />
  )
}
```

---

## 🛠️ Utility Functions

### From `utils/helpers.js`:

```jsx
import { formatDate, debounce, generateId } from './utils'

// Format date
formatDate(new Date()) // "October 14, 2025"

// Debounce
const handleSearch = debounce((query) => {
  // Search logic
}, 300)

// Generate unique ID
const id = generateId() // "1697385600000-x8k9mq3p1"
```

### From `utils/constants.js`:

```jsx
import { APP_NAME, APP_VERSION, ROUTES } from './utils'

console.log(APP_NAME)    // "Alcel Marine App"
console.log(APP_VERSION) // "1.0.0"
console.log(ROUTES.HOME) // "/"
```

---

## 📁 Import Patterns

```jsx
// UI Components
import { Button, Card, Container } from './components/ui'

// Layout
import { Layout, Header, Footer } from './components/layout'

// Features
import { Counter } from './features/Counter'
import { Welcome } from './features/Welcome'

// Hooks
import { useLocalStorage } from './hooks'

// Utils
import { formatDate, APP_NAME } from './utils'
```

---

## 🎯 Common Tasks

### Add a new feature:

1. Create folder: `src/features/MyFeature/`
2. Create component: `MyFeature.jsx`
3. Create export: `index.js`
4. Import in `App.jsx`

### Add a new UI component:

1. Create: `src/components/ui/MyComponent.jsx`
2. Export in: `src/components/ui/index.js`
3. Use anywhere: `import { MyComponent } from './components/ui'`

### Add a new hook:

1. Create: `src/hooks/useMyHook.js`
2. Export in: `src/hooks/index.js`
3. Use: `import { useMyHook } from './hooks'`

### Add a utility function:

1. Add to: `src/utils/helpers.js`
2. Export in: `src/utils/index.js`
3. Use: `import { myFunction } from './utils'`

---

## 🎨 Tailwind Common Classes

### Colors (Dark Mode)
- Text: `text-white`, `text-gray-300`, `text-gray-400`
- Background: `bg-gray-800`, `bg-gray-700`, `bg-gray-900`
- Gradients: `from-blue-600 to-cyan-600`

### Effects
- Glass: `backdrop-blur-xl bg-gray-800/50`
- Shadow: `shadow-xl`, `shadow-2xl`
- Border: `border border-gray-700/50`
- Rounded: `rounded-lg`, `rounded-xl`, `rounded-2xl`

### Transitions
- All: `transition-all duration-200`
- Colors: `transition-colors duration-300`
- Transform: `hover:scale-105 active:scale-95`

---

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📱 Responsive Design

Tailwind breakpoints:
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

Example:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

---

## 🔍 File Locations

- **Main App**: `src/App.jsx`
- **Entry Point**: `src/main.jsx`
- **Global Styles**: `src/index.css`
- **Config**: `tailwind.config.js`, `vite.config.js`
- **Dependencies**: `package.json`

---

## 💡 Pro Tips

1. Always use existing UI components
2. Keep features in separate folders
3. Export through index.js files
4. Use Tailwind classes (avoid custom CSS)
5. Test features independently
6. Document with JSDoc comments

---

**Quick Start:** Open http://localhost:5174 to see your app! 🚀

