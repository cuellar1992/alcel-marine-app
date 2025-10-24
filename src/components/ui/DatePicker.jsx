/**
 * DatePicker Component
 * Premium date picker (date only, no time) with "Today" button
 */

import { forwardRef } from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Calendar } from 'lucide-react'

const CustomInput = forwardRef(({ value, onClick, label, required, onTodayClick }, ref) => (
  <div className="space-y-2">
    {label && (
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-cyan-400 ml-1">*</span>}
        </label>
        {onTodayClick && (
          <button
            type="button"
            onClick={onTodayClick}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-1 font-medium"
          >
            <Calendar className="w-3.5 h-3.5" />
            Today
          </button>
        )}
      </div>
    )}
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white text-left
        focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 
        transition-all duration-300 backdrop-blur-xl hover:border-white/20 flex items-center justify-between"
    >
      <span className={value ? 'text-white' : 'text-gray-500'}>
        {value || 'Select date'}
      </span>
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </button>
  </div>
))

CustomInput.displayName = 'CustomInput'

export default function DatePicker({ 
  label, 
  selected, 
  onChange, 
  required = false,
  showTodayButton = false,
  ...props 
}) {
  const handleTodayClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(new Date())
  }

  return (
    <div className="datepicker-wrapper-custom">
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="MMMM d, yyyy"
        customInput={
          <CustomInput 
            label={label} 
            required={required}
            onTodayClick={showTodayButton ? handleTodayClick : null}
          />
        }
        calendarClassName="premium-calendar"
        popperClassName="react-datepicker-popper-custom"
        popperPlacement="bottom-start"
        popperModifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 4],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              rootBoundary: 'viewport',
              padding: 8,
            },
          },
        ]}
        {...props}
      />
    </div>
  )
}
