/**
 * Feature Cards Module
 * Premium technology showcase cards
 */

import { Card } from '../../components/ui'

const features = [
  {
    icon: '⚛️',
    title: 'React 18',
    description: 'Latest version of React with all modern features',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconGradient: 'from-blue-400 to-cyan-400',
  },
  {
    icon: '🎨',
    title: 'Tailwind CSS',
    description: 'Utility-first CSS framework for rapid beautiful designs',
    gradient: 'from-cyan-500/20 to-teal-500/20',
    iconGradient: 'from-cyan-400 to-teal-400',
  },
  {
    icon: '⚡',
    title: 'Vite',
    description: 'Ultra-fast build tool for modern development',
    gradient: 'from-purple-500/20 to-pink-500/20',
    iconGradient: 'from-purple-400 to-pink-400',
  },
]

export default function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature) => (
        <Card 
          key={feature.title} 
          variant="gradient" 
          hover={true}
          className="p-8 group"
        >
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full`}></div>
            <div className="text-5xl mb-4 relative transform group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
          </div>
          <h3 className={`font-bold text-xl mb-3 bg-gradient-to-r ${feature.iconGradient} bg-clip-text text-transparent`}>
            {feature.title}
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {feature.description}
          </p>
        </Card>
      ))}
    </div>
  )
}

