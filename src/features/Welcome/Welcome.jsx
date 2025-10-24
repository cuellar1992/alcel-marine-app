/**
 * Welcome Feature Module
 * Premium welcome section
 */

import { Card } from '../../components/ui'

export default function Welcome() {
  return (
    <Card variant="gradient" className="p-12 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative text-center">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent mb-6 leading-tight">
          Welcome to Your App
        </h2>
        <p className="text-xl text-gray-300 mb-4 font-light">
          Modern web application built with React + Tailwind CSS
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 mx-auto mb-6 rounded-full"></div>
        <p className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
          This modular architecture allows you to add new features without breaking existing functionality. 
          Built with premium design principles and cutting-edge technologies.
        </p>
      </div>
    </Card>
  )
}

