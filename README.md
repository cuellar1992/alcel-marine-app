# ⚓ Alcel Marine App

Modern web application built with **React** and **Tailwind CSS** using a **modular, scalable architecture**.

## 🚀 Technologies

- **React 18** - Modern UI library with latest features
- **Tailwind CSS 3** - Utility-first CSS framework
- **Vite** - Lightning-fast build tool and dev server

## ✨ Key Features

- 🎨 **Elegant Dark Mode Design** - Beautiful glassmorphism effects
- 🧩 **Modular Architecture** - Add features without breaking existing code
- 📦 **Reusable Components** - Pre-built UI components ready to use
- 🔧 **Easy Maintenance** - Well-organized, documented code
- 🚀 **Fast Development** - Hot reload and instant feedback

## 📦 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open **http://localhost:5174** in your browser

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Button, Card, Container
│   └── layout/         # Header, Footer, Layout
├── features/           # Self-contained feature modules
│   ├── Counter/
│   ├── Welcome/
│   └── FeatureCards/
├── hooks/              # Custom React hooks
├── utils/              # Helper functions and constants
├── App.jsx             # Main app component
└── main.jsx            # React entry point
```

## 📚 Documentation

All detailed documentation is organized in the `/documents` folder:

- 📖 **[documents/INDEX.md](documents/INDEX.md)** - Complete documentation index
- 📁 **[documents/PROJECT_STRUCTURE.md](documents/PROJECT_STRUCTURE.md)** - Detailed architecture
- 🛠️ **[documents/DEVELOPMENT_GUIDE.md](documents/DEVELOPMENT_GUIDE.md)** - Step-by-step development
- ⚡ **[documents/QUICK_REFERENCE.md](documents/QUICK_REFERENCE.md)** - Quick component reference
- 🔧 **[documents/BACKEND_SETUP.md](documents/BACKEND_SETUP.md)** - MongoDB Atlas configuration

## 🎯 Adding a New Feature

1. Create folder: `src/features/MyFeature/`
2. Build component: `MyFeature.jsx`
3. Export: `index.js`
4. Import in `App.jsx`

**That's it!** No existing code is modified.

See [DEVELOPMENT_GUIDE.md](documents/DEVELOPMENT_GUIDE.md) for detailed examples.

## 🎨 Available Components

### UI Components
- **Button** - Multiple variants (primary, secondary, outline, ghost)
- **Card** - Glass effect containers with hover states
- **Container** - Responsive page containers

### Layout Components
- **Layout** - Page wrapper with header and footer
- **Header** - Sticky navigation header
- **Footer** - Application footer

See [QUICK_REFERENCE.md](documents/QUICK_REFERENCE.md) for usage examples.

## 🪝 Custom Hooks

- **useLocalStorage** - Persist state in browser storage

## 🛠️ Utilities

- **formatDate** - Format dates for display
- **debounce** - Limit function execution rate
- **generateId** - Create unique identifiers
- **Constants** - App-wide configuration

## 🎨 Design System

- **Dark Mode First** - Elegant dark theme
- **Glassmorphism** - Modern glass effects
- **Smooth Animations** - Transitions and hover effects
- **Responsive** - Mobile-first design
- **Accessible** - Semantic HTML and ARIA labels

## 📱 Responsive Breakpoints

- `sm:` 640px - Small tablets
- `md:` 768px - Tablets
- `lg:` 1024px - Laptops
- `xl:` 1280px - Desktops

## 🔧 Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration
- `vite.config.js` - Vite build configuration
- `postcss.config.js` - PostCSS configuration
- `package.json` - Dependencies and scripts

## 💡 Development Best Practices

1. ✅ Keep features modular and isolated
2. ✅ Reuse existing UI components
3. ✅ Use Tailwind utility classes
4. ✅ Document your code with JSDoc
5. ✅ Test features independently
6. ✅ Follow existing patterns

## 🚀 Recommended Next Steps

- 🔀 Add React Router for navigation
- 🔄 Implement Context API for state management
- 🌐 Create API service layer
- 📝 Add form validation
- ✨ Integrate animations (Framer Motion)
- 🎯 Add icon library (react-icons)

## 📝 License

Private Project - Alcel Marine © 2025

---

**Built with ❤️ using React + Tailwind CSS**

For questions or issues, check the documentation files or create an issue.

