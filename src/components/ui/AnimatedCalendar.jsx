/**
 * AnimatedCalendar Component
 * Multi-view calendar with smooth animations using Framer Motion
 * Three views: Days, Months, Years
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, getDaysInMonth, startOfMonth, getDay, addMonths, subMonths, isSameDay, isToday } from 'date-fns'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function AnimatedCalendar({ selected, onSelect, minDate, maxDate }) {
  const [view, setView] = useState('days') // 'days', 'months', 'years'
  const [currentDate, setCurrentDate] = useState(selected || new Date())
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    if (selected) {
      setCurrentDate(selected)
    }
  }, [selected])

  // Generate years array (from 1990 to current year + 10)
  const generateYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = 1990; year <= currentYear + 10; year++) {
      years.push(year)
    }
    return years
  }

  // Generate days for current month
  const generateDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDayOfMonth = getDay(startOfMonth(currentDate))

    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  // Handle header click - switch between views
  const handleHeaderClick = () => {
    if (view === 'days') {
      setView('months')
    } else if (view === 'months') {
      setView('years')
    }
  }

  // Handle month navigation
  const navigateMonth = (offset) => {
    setDirection(offset)
    setCurrentDate(offset > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
  }

  // Handle day selection
  const handleDayClick = (day) => {
    if (!day) return

    // Check if date is within min/max range
    if (minDate && day < minDate) return
    if (maxDate && day > maxDate) return

    onSelect(day)
  }

  // Handle month selection
  const handleMonthClick = (monthIndex) => {
    const newDate = new Date(currentDate.getFullYear(), monthIndex, 1)
    setCurrentDate(newDate)
    setView('days')
  }

  // Handle year selection
  const handleYearClick = (year) => {
    const newDate = new Date(year, currentDate.getMonth(), 1)
    setCurrentDate(newDate)
    setView('months')
  }

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0
    })
  }

  const fadeVariants = {
    enter: { opacity: 0, scale: 0.95 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        {view === 'days' && (
          <>
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-300" />
            </button>

            <motion.button
              onClick={handleHeaderClick}
              className="text-lg font-semibold text-white hover:text-cyan-400 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {format(currentDate, 'MMMM yyyy')}
            </motion.button>

            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          </>
        )}

        {view === 'months' && (
          <motion.button
            onClick={handleHeaderClick}
            className="text-lg font-semibold text-white hover:text-cyan-400 transition-colors cursor-pointer mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentDate.getFullYear()}
          </motion.button>
        )}

        {view === 'years' && (
          <div className="text-lg font-semibold text-white mx-auto">
            Select Year
          </div>
        )}
      </div>

      {/* Calendar Views */}
      <AnimatePresence mode="wait" custom={direction}>
        {view === 'days' && (
          <motion.div
            key="days"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {generateDays().map((day, index) => {
                const isSelected = day && selected && isSameDay(day, selected)
                const isCurrentDay = day && isToday(day)
                const isDisabled = day && ((minDate && day < minDate) || (maxDate && day > maxDate))

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleDayClick(day)}
                    disabled={!day || isDisabled}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${!day ? 'invisible' : ''}
                      ${isDisabled ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-white/10'}
                      ${isSelected ? 'bg-cyan-500 text-white hover:bg-cyan-600' : ''}
                      ${isCurrentDay && !isSelected ? 'border-2 border-cyan-400' : ''}
                    `}
                    whileHover={day && !isDisabled ? { scale: 1.1 } : {}}
                    whileTap={day && !isDisabled ? { scale: 0.95 } : {}}
                  >
                    {day ? format(day, 'd') : ''}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {view === 'months' && (
          <motion.div
            key="months"
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="grid grid-cols-3 gap-3"
          >
            {MONTHS.map((month, index) => {
              const isCurrentMonth = index === currentDate.getMonth()

              return (
                <motion.button
                  key={month}
                  onClick={() => handleMonthClick(index)}
                  className={`
                    py-4 px-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isCurrentMonth ? 'bg-cyan-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {month}
                </motion.button>
              )
            })}
          </motion.div>
        )}

        {view === 'years' && (
          <motion.div
            key="years"
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-2"
          >
            {generateYears().map((year) => {
              const isCurrentYear = year === currentDate.getFullYear()

              return (
                <motion.button
                  key={year}
                  onClick={() => handleYearClick(year)}
                  className={`
                    py-3 px-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isCurrentYear ? 'bg-cyan-500 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {year}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
