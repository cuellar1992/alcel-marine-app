# 🛠️ Development Guide

## Quick Start for Adding Features

This guide shows you how to add new features to the app following our modular architecture.

## ✅ Current Architecture Benefits

- ✨ **Zero Breaking Changes** - Add features without touching existing code
- 🧩 **Self-Contained Modules** - Each feature is independent
- 🔄 **Reusable Components** - Use existing UI components
- 📦 **Easy Maintenance** - Find and fix bugs quickly
- 🚀 **Fast Development** - Copy patterns from existing features

---

## 📚 Component Usage Examples

### Using the Button Component

```jsx
import { Button } from './components/ui'

// Primary button (default)
<Button onClick={handleClick}>Click Me</Button>

// Different variants
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Disabled state
<Button disabled>Disabled</Button>

// Custom classes
<Button className="w-full">Full Width</Button>
```

### Using the Card Component

```jsx
import { Card } from './components/ui'

// Basic card
<Card className="p-6">
  <h3>Title</h3>
  <p>Content</p>
</Card>

// With variants
<Card variant="default">Default Style</Card>
<Card variant="gradient">Gradient Background</Card>
<Card variant="solid">Solid Background</Card>

// With hover effect
<Card hover={true} className="p-6">
  Hover me!
</Card>
```

### Using the Container Component

```jsx
import { Container } from './components/ui'

// Default container
<Container>
  Content here
</Container>

// Different sizes
<Container size="sm">Small (max-w-3xl)</Container>
<Container size="default">Default (max-w-7xl)</Container>
<Container size="lg">Large (max-w-[1400px])</Container>
<Container size="full">Full Width</Container>
```

---

## 🎯 Step-by-Step: Adding a New Feature

### Example: Creating a "TodoList" Feature

#### Step 1: Create Feature Folder
```bash
src/features/TodoList/
```

#### Step 2: Create the Component

```jsx
// src/features/TodoList/TodoList.jsx
import { useState } from 'react'
import { Button, Card } from '../../components/ui'
import { generateId } from '../../utils'

export default function TodoList() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: generateId(), text: input, done: false }])
      setInput('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Todo List</h2>
      
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <Button onClick={addTodo}>Add</Button>
      </div>

      <div className="space-y-2">
        {todos.map(todo => (
          <div 
            key={todo.id}
            className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg"
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              className="w-5 h-5 cursor-pointer"
            />
            <span className={`flex-1 text-gray-300 ${todo.done ? 'line-through opacity-50' : ''}`}>
              {todo.text}
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>

      {todos.length === 0 && (
        <p className="text-center text-gray-500 py-8">No tasks yet. Add one above!</p>
      )}
    </Card>
  )
}
```

#### Step 3: Create Index Export

```jsx
// src/features/TodoList/index.js
export { default as TodoList } from './TodoList'
```

#### Step 4: Add to App.jsx

```jsx
// src/App.jsx
import { TodoList } from './features/TodoList'

function App() {
  return (
    <Layout>
      <Container className="py-12 space-y-8">
        <Welcome />
        <Counter />
        <TodoList />  {/* ← Add your new feature here */}
        <FeatureCards />
      </Container>
    </Layout>
  )
}
```

**Done!** Your new feature is integrated without modifying any existing code.

---

## 🎨 Creating Custom UI Components

### Example: Badge Component

```jsx
// src/components/ui/Badge.jsx
const variants = {
  primary: 'bg-blue-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-black',
  danger: 'bg-red-500 text-white',
}

export default function Badge({ children, variant = 'primary' }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  )
}
```

Add to `src/components/ui/index.js`:
```jsx
export { default as Badge } from './Badge'
```

---

## 🪝 Creating Custom Hooks

### Example: useToggle Hook

```jsx
// src/hooks/useToggle.js
import { useState } from 'react'

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = () => setValue(!value)
  const setTrue = () => setValue(true)
  const setFalse = () => setValue(false)

  return [value, { toggle, setTrue, setFalse }]
}
```

Usage:
```jsx
import { useToggle } from './hooks'

function MyComponent() {
  const [isOpen, { toggle, setTrue, setFalse }] = useToggle(false)
  
  return (
    <Button onClick={toggle}>
      {isOpen ? 'Close' : 'Open'}
    </Button>
  )
}
```

---

## 📋 Best Practices Checklist

When adding a new feature:

- [ ] Create a new folder in `src/features/`
- [ ] Keep all related code in the feature folder
- [ ] Use existing UI components from `src/components/ui/`
- [ ] Export through an `index.js` file
- [ ] Add JSDoc comments to document the feature
- [ ] Test the feature independently
- [ ] Import and use in `App.jsx`
- [ ] Verify no breaking changes to existing features

---

## 🔧 Utility Functions

Available helper functions:

```jsx
import { 
  formatDate, 
  debounce, 
  generateId,
  APP_NAME,
  APP_VERSION 
} from './utils'

// Format date
const formattedDate = formatDate(new Date())  // "October 14, 2025"

// Debounce function
const debouncedSearch = debounce(searchFunction, 300)

// Generate unique ID
const uniqueId = generateId()  // "1697385600000-x8k9mq3p1"

// Use constants
console.log(APP_NAME)  // "Alcel Marine App"
```

---

## 🚀 Next Steps

1. **Add Routing** - Install React Router for multi-page navigation
2. **State Management** - Add Context API or Redux if needed
3. **API Integration** - Create a `services/` folder for API calls
4. **Forms** - Add form validation with libraries like React Hook Form
5. **Animations** - Install Framer Motion for smooth transitions
6. **Icons** - Add react-icons or heroicons

---

## 💡 Tips

- **Keep features small** - One feature = one responsibility
- **Reuse components** - Don't recreate what exists
- **Document your code** - Help future you and your team
- **Test incrementally** - Add one feature at a time
- **Follow the pattern** - Look at existing features for reference

Happy coding! 🎉

