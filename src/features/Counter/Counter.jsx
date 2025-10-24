/**
 * Counter Feature Module
 * Premium interactive counter with enhanced effects
 */

import { useState } from 'react'
import { Button, Card } from '../../components/ui'

export default function Counter() {
  const [count, setCount] = useState(0)

  const increment = () => {
    setCount(count + 1)
  }

  const decrement = () => {
    setCount(count - 1)
  }

  const reset = () => {
    setCount(0)
  }

  return (
    <Card variant="gradient" className="p-10">
      <div className="text-center">
        <h3 className="text-white text-2xl mb-6 font-light tracking-wide">Interactive Counter</h3>
        
        <div className="relative group mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative bg-gradient-to-br from-blue-600/20 via-cyan-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-12 border border-white/10">
            <div className="text-8xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent drop-shadow-2xl">
              {count}
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button onClick={decrement} variant="secondary" size="md">
            Decrement
          </Button>
          <Button onClick={reset} variant="outline" size="md">
            Reset
          </Button>
          <Button onClick={increment} variant="primary" size="md">
            Increment
          </Button>
        </div>
      </div>
    </Card>
  )
}

