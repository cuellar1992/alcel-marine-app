/**
 * DateTimePicker Component
 * Premium date and time picker with calendar
 */

import { forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const CustomInput = forwardRef(({ value, onClick, label, required }, ref) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-cyan-400 ml-1">*</span>}
      </label>
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
        {value || 'Select date and time'}
      </span>
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </button>
  </div>
))

CustomInput.displayName = 'CustomInput'

export default function DateTimePicker({ 
  label, 
  selected, 
  onChange, 
  required = false,
  ...props 
}) {
  return (
    <div className="datepicker-wrapper-custom">
      <DatePicker
        selected={selected}
        onChange={onChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
        customInput={<CustomInput label={label} required={required} />}
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

