/**
 * DateTimePicker Component
 * Modern date and time picker with animated multi-view calendar
 * Solución definitiva con portal y posicionamiento correcto
 */

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { format } from 'date-fns'
import AnimatedCalendar from './AnimatedCalendar'

export default function DateTimePicker({
  label,
  selected,
  onChange,
  required = false,
  minDate,
  maxDate,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState('00:00')
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef(null)
  const calendarRef = useRef(null)

  // Initialize time from selected date
  useEffect(() => {
    if (selected) {
      const hours = selected.getHours().toString().padStart(2, '0')
      const minutes = selected.getMinutes().toString().padStart(2, '0')
      setSelectedTime(`${hours}:${minutes}`)
    } else {
      setSelectedTime('00:00')
    }
  }, [selected])

  // Calculate position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = () => {
        const rect = buttonRef.current.getBoundingClientRect()
        setPosition({
          top: rect.bottom + 4,
          left: rect.left,
        })
      }

      updatePosition()
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)

      return () => {
        window.removeEventListener('scroll', updatePosition, true)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [isOpen])

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleDaySelect = (date) => {
    if (!date) return

    // Combine date with time
    if (selectedTime) {
      const [hours, minutes] = selectedTime.split(':')
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10))
    } else {
      date.setHours(0, 0, 0, 0)
    }

    onChange(date)
  }

  const handleTimeChange = (e) => {
    const time = e.target.value
    setSelectedTime(time)

    if (selected && time) {
      const [hours, minutes] = time.split(':')
      const newDate = new Date(selected)
      newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10))
      onChange(newDate)
    }
  }

  const displayValue = selected
    ? `${format(selected, 'MMMM d, yyyy')} ${format(selected, 'h:mm aa')}`
    : ''

  const calendarPortal = isOpen ? createPortal(
    <div
      ref={calendarRef}
      className="datetime-picker-popup"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999999,
        pointerEvents: 'auto',
      }}
    >
      <div className="datetime-picker-container">
        <AnimatedCalendar
          selected={selected}
          onSelect={handleDaySelect}
          minDate={minDate}
          maxDate={maxDate}
        />

        <div className="time-picker-section">
          <label className="text-sm font-medium text-gray-300 block mb-2">Time</label>
          <input
            type="time"
            value={selectedTime}
            onChange={handleTimeChange}
            className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white
              focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20
              transition-all duration-300"
          />
        </div>
      </div>
    </div>,
    document.body
  ) : null

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-cyan-400 ml-1">*</span>}
        </label>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white text-left
          focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20
          transition-all duration-300 backdrop-blur-xl hover:border-white/20 flex items-center justify-between"
      >
        <span className={displayValue ? 'text-white' : 'text-gray-500'}>
          {displayValue || 'Select date and time'}
        </span>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {calendarPortal}
    </div>
  )
}
