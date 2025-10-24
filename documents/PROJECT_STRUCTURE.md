# 📁 Project Structure

## Modular Architecture

This project follows a **modular, scalable architecture** that allows you to add new features without breaking existing functionality.

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI building blocks
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Container.jsx
│   │   └── index.js
│   └── layout/         # Layout components
│       ├── Header.jsx
│       ├── Footer.jsx
│       ├── Layout.jsx
│       └── index.js
│
├── features/           # Feature modules (self-contained)
│   ├── Counter/
│   │   ├── Counter.jsx
│   │   └── index.js
│   ├── Welcome/
│   │   ├── Welcome.jsx
│   │   └── index.js
│   └── FeatureCards/
│       ├── FeatureCards.jsx
│       └── index.js
│
├── hooks/              # Custom React hooks
│   ├── useLocalStorage.js
│   └── index.js
│
├── utils/              # Utility functions and constants
│   ├── constants.js
│   ├── helpers.js
│   └── index.js
│
├── App.jsx             # Main app component
├── main.jsx            # React entry point
└── index.css           # Global styles
```

## 🎯 Design Principles

### 1. **Modularity**
Each feature is self-contained in its own folder with all related code.

### 2. **Separation of Concerns**
- `components/ui` - Reusable UI components
- `components/layout` - Page structure components
- `features/` - Business logic and feature modules
- `hooks/` - Reusable React logic
- `utils/` - Helper functions and constants

### 3. **Easy to Extend**
To add a new feature:
1. Create a new folder in `features/`
2. Build your feature component
3. Export it from an `index.js`
4. Import and use it in `App.jsx`

### 4. **No Breaking Changes**
Each module is independent. Changes to one feature don't affect others.

## 📝 How to Add a New Feature

### Example: Adding a "Dashboard" feature

1. **Create the feature folder:**
```bash
src/features/Dashboard/
```

2. **Create your component:**
```jsx
// src/features/Dashboard/Dashboard.jsx
import { Card } from '../../components/ui'

export default function Dashboard() {
  return (
    <Card className="p-8">
      <h2 className="text-2xl text-white">Dashboard</h2>
      {/* Your dashboard content */}
    </Card>
  )
}
```

3. **Export it:**
```javascript
// src/features/Dashboard/index.js
export { default as Dashboard } from './Dashboard'
```

4. **Use it in App.jsx:**
```jsx
import { Dashboard } from './features/Dashboard'

function App() {
  return (
    <Layout>
      <Container>
        <Dashboard />
      </Container>
    </Layout>
  )
}
```

## 🔧 Available Components

### UI Components
- **Button** - Customizable button with variants (primary, secondary, outline, ghost)
- **Card** - Glass-effect card container
- **Container** - Responsive container with max-width

### Layout Components
- **Layout** - Main page wrapper with header and footer
- **Header** - App header (sticky)
- **Footer** - App footer

### Custom Hooks
- **useLocalStorage** - Persist state in localStorage

### Utils
- **constants.js** - App-wide constants
- **helpers.js** - Utility functions (formatDate, debounce, generateId)

## 🎨 Styling Guidelines

- Use Tailwind CSS utility classes
- Dark mode first design
- Consistent spacing and colors
- Glass morphism effects with `backdrop-blur`
- Smooth transitions and hover effects

## 🚀 Best Practices

1. **One feature per folder** - Keep features isolated
2. **Export through index.js** - Clean imports
3. **Reuse UI components** - Don't recreate common elements
4. **Document your code** - Add JSDoc comments
5. **Follow naming conventions** - PascalCase for components

## 📦 Future Extensions

Recommended folders to add as the app grows:
- `src/services/` - API calls and external services
- `src/context/` - React Context providers
- `src/pages/` - Page components (when adding routing)
- `src/assets/` - Images, icons, fonts
- `src/styles/` - Additional CSS modules
- `src/types/` - TypeScript definitions (if migrating to TS)

