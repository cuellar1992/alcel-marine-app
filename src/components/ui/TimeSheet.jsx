import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Clock, Calendar, FileText, Download } from 'lucide-react'
import { timeSheetAPI } from '../../services'
import toast from 'react-hot-toast'
import DatePicker from './DatePicker'
import Input from './Input'
import Button from './Button'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

const TimeSheet = ({ claimId, isVisible = true }) => {
  const [entries, setEntries] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [editingId, setEditingId] = useState(null)
  
  // Form data for new entry
  const [formData, setFormData] = useState({
    date: new Date(),
    timeMinutes: '',
    description: ''
  })

  // Load timesheet entries
  const loadEntries = async () => {
    if (!claimId) return
    
    try {
      setLoading(true)
      const [entriesResponse, summaryResponse] = await Promise.all([
        timeSheetAPI.getEntries(claimId),
        timeSheetAPI.getSummary(claimId)
      ])
      
      if (entriesResponse.success) {
        setEntries(entriesResponse.data)
      }
      
      if (summaryResponse.success) {
        setSummary(summaryResponse.data)
      }
    } catch (error) {
      console.error('Error loading timesheet:', error)
      toast.error('Error loading timesheet entries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isVisible && claimId) {
      loadEntries()
    }
  }, [claimId, isVisible])

  // Handle form input changes
  const handleInputChange = (field, value) => {
    if (field === 'timeMinutes') {
      // Only allow numbers for time minutes
      const numericValue = value.replace(/[^0-9]/g, '')
      setFormData(prev => ({ ...prev, [field]: numericValue }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  // Add new timesheet entry
  const handleAddEntry = async () => {
    if (!formData.description.trim()) {
      toast.error('Description is required')
      return
    }
    
    if (!formData.timeMinutes || parseInt(formData.timeMinutes) <= 0) {
      toast.error('Please enter valid time in minutes')
      return
    }

    try {
      const response = await timeSheetAPI.create({
        claimId,
        date: formData.date,
        timeMinutes: parseInt(formData.timeMinutes),
        description: formData.description.trim()
      })

      if (response.success) {
        toast.success('TimeSheet entry added successfully')
        setFormData({
          date: new Date(),
          timeMinutes: '',
          description: ''
        })
        loadEntries() // Reload entries
      }
    } catch (error) {
      console.error('Error adding timesheet entry:', error)
      toast.error('Error adding timesheet entry')
    }
  }

  // Update timesheet entry
  const handleUpdateEntry = async (id, updateData) => {
    try {
      const response = await timeSheetAPI.update(id, updateData)
      
      if (response.success) {
        toast.success('TimeSheet entry updated successfully')
        setEditingId(null)
        loadEntries() // Reload entries
      }
    } catch (error) {
      console.error('Error updating timesheet entry:', error)
      toast.error('Error updating timesheet entry')
    }
  }

  // Delete timesheet entry
  const handleDeleteEntry = async (id) => {
    if (!confirm('Are you sure you want to delete this timesheet entry?')) {
      return
    }

    try {
      const response = await timeSheetAPI.delete(id)
      
      if (response.success) {
        toast.success('TimeSheet entry deleted successfully')
        loadEntries() // Reload entries
      }
    } catch (error) {
      console.error('Error deleting timesheet entry:', error)
      toast.error('Error deleting timesheet entry')
    }
  }

  // Format minutes to hours and minutes
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    })
  }

  // Export timesheet to Excel
  const handleExportToExcel = async () => {
    if (entries.length === 0) {
      toast.error('No timesheet entries to export')
      return
    }

    try {
      const loadingToast = toast.loading('Generating Excel file...')
      
      const workbook = new ExcelJS.Workbook()
      workbook.creator = 'Alcel Marine'
      workbook.created = new Date()
      
      const worksheet = workbook.addWorksheet('Time Sheet', {
        properties: { tabColor: { argb: '06B6D4' } },
        views: [{ state: 'frozen', xSplit: 0, ySplit: 1, showGridLines: false }]
      })

      // Define columns
      worksheet.columns = [
        { header: 'Date', key: 'date', width: 20 },
        { header: 'Time (mins)', key: 'timeMinutes', width: 15 },
        { header: 'Time', key: 'timeFormatted', width: 15 },
        { header: 'Description', key: 'description', width: 50 }
      ]

      // Style header
      const headerRow = worksheet.getRow(1)
      headerRow.height = 30
      headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '06B6D4' } }
        cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFF' } }
        cell.alignment = { vertical: 'middle', horizontal: 'center' }
        cell.border = {
          top: { style: 'thin', color: { argb: '94A3B8' } },
          bottom: { style: 'thin', color: { argb: '94A3B8' } },
          left: { style: 'thin', color: { argb: '94A3B8' } },
          right: { style: 'thin', color: { argb: '94A3B8' } }
        }
      })

      // Sort entries from oldest to newest (reverse of display order)
      const sortedEntries = [...entries].sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      )

      // Add data rows
      sortedEntries.forEach((entry, index) => {
        const entryDate = new Date(entry.date)
        
        const row = worksheet.addRow({
          date: entryDate.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          }),
          timeMinutes: entry.timeMinutes,
          timeFormatted: formatTime(entry.timeMinutes),
          description: entry.description
        })

        const isEven = index % 2 === 0
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isEven ? 'F8FAFC' : 'FFFFFF' } }
          cell.font = { name: 'Calibri', size: 11, color: { argb: '1E293B' } }
          cell.alignment = { vertical: 'middle', horizontal: 'left' }
          cell.border = {
            top: { style: 'thin', color: { argb: 'E2E8F0' } },
            bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
            left: { style: 'thin', color: { argb: 'E2E8F0' } },
            right: { style: 'thin', color: { argb: 'E2E8F0' } }
          }
        })

        // Center align time columns
        row.getCell('timeMinutes').alignment = { vertical: 'middle', horizontal: 'center' }
        row.getCell('timeFormatted').alignment = { vertical: 'middle', horizontal: 'center' }
        row.getCell('timeFormatted').font = { ...row.getCell('timeFormatted').font, bold: true, color: { argb: '06B6D4' } }
      })

      // Add summary row
      if (summary) {
        worksheet.addRow({}) // Empty row for spacing
        
        const summaryRow = worksheet.addRow({
          date: 'SUMMARY',
          timeMinutes: summary.totalMinutes,
          timeFormatted: summary.formattedTotal,
          description: `Total entries: ${summary.totalEntries}`
        })

        summaryRow.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DBEAFE' } }
          cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: '1E293B' } }
          cell.alignment = { vertical: 'middle', horizontal: 'left' }
          cell.border = {
            top: { style: 'medium', color: { argb: '06B6D4' } },
            bottom: { style: 'medium', color: { argb: '06B6D4' } },
            left: { style: 'medium', color: { argb: '06B6D4' } },
            right: { style: 'medium', color: { argb: '06B6D4' } }
          }
        })

        summaryRow.getCell('timeMinutes').alignment = { vertical: 'middle', horizontal: 'center' }
        summaryRow.getCell('timeFormatted').alignment = { vertical: 'middle', horizontal: 'center' }
        summaryRow.getCell('timeFormatted').font = { ...summaryRow.getCell('timeFormatted').font, color: { argb: '059669' } }
      }

      // Add footer
      const footerRow = worksheet.addRow({
        date: '',
        timeMinutes: '',
        timeFormatted: '',
        description: `Generated on ${new Date().toLocaleString('en-US')}`
      })
      footerRow.eachCell((cell) => {
        cell.font = { name: 'Calibri', size: 9, italic: true, color: { argb: '94A3B8' } }
        cell.alignment = { vertical: 'middle', horizontal: 'right' }
      })

      // Generate and save file
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      
      saveAs(blob, `TimeSheet_${new Date().toISOString().split('T')[0]}.xlsx`)
      
      toast.dismiss(loadingToast)
      toast.success(`Successfully exported ${entries.length} time sheet entries to Excel!`)
    } catch (error) {
      console.error('Error exporting timesheet:', error)
      toast.error('Failed to export timesheet to Excel')
    }
  }

  if (!isVisible) return null

  return (
    <div className="bg-slate-800/30 backdrop-blur-xl rounded-xl border border-white/10 p-6">
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Time Sheet</h3>
          {summary && (
            <span className="text-sm text-gray-400">
              ({summary.formattedTotal})
            </span>
          )}
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>

      {!isCollapsed && (
        <div className="mt-6 space-y-6">
          {/* Add New Entry Form */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-white/5">
            <h4 className="text-sm font-medium text-gray-300 mb-4 flex items-center">
              <Plus className="w-4 h-4 mr-2 text-cyan-400" />
              Add New Entry
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-[120px_90px_1fr_auto] gap-3 items-end">
              {/* Date - Compact version */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Date <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <DatePicker
                    selected={formData.date}
                    onChange={(date) => handleInputChange('date', date)}
                    dateFormat="MMM dd"
                    customInput={
                      <button
                        type="button"
                        className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-left text-sm
                          focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 
                          transition-all duration-300 backdrop-blur-xl hover:border-white/20 flex items-center justify-between"
                      >
                        <span className="text-white text-sm">
                          {formData.date ? formData.date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : 'Select date'}
                        </span>
                        <Calendar className="w-4 h-4 text-gray-400" />
                      </button>
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
                  />
                </div>
              </div>

              {/* Time Minutes - Same style as Date */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Time (mins) <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.timeMinutes}
                  onChange={(e) => handleInputChange('timeMinutes', e.target.value)}
                  placeholder="120"
                  className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm
                    focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 
                    transition-all duration-300 backdrop-blur-xl hover:border-white/20"
                />
              </div>

              {/* Description - Expands to fill available space */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Description <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Work description"
                  className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm
                    focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 
                    transition-all duration-300 backdrop-blur-xl hover:border-white/20"
                />
              </div>

              {/* Add Button - Icon only, compact */}
              <div className="flex items-end">
                <button
                  onClick={handleAddEntry}
                  disabled={loading}
                  title="Add entry"
                  className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 text-white p-2 rounded-lg
                    transition-all duration-300 flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* TimeSheet Entries */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading entries...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No timesheet entries yet</p>
                <p className="text-sm">Add your first entry using the form above</p>
              </div>
            ) : (
              entries.map((entry) => (
                <TimeSheetEntry
                  key={entry._id}
                  entry={entry}
                  isEditing={editingId === entry._id}
                  onEdit={() => setEditingId(entry._id)}
                  onSave={(updateData) => handleUpdateEntry(entry._id, updateData)}
                  onCancel={() => setEditingId(null)}
                  onDelete={() => handleDeleteEntry(entry._id)}
                  formatTime={formatTime}
                  formatDate={formatDate}
                />
              ))
            )}
          </div>

          {/* Summary */}
          {summary && summary.totalEntries > 0 && (
            <div className="bg-slate-900/30 rounded-lg p-4 border border-white/5">
              <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-cyan-400" />
                Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Total Entries:</span>
                  <p className="text-white font-medium">{summary.totalEntries}</p>
                </div>
                <div>
                  <span className="text-gray-400">Total Time:</span>
                  <p className="text-white font-medium">{summary.formattedTotal}</p>
                </div>
                <div>
                  <span className="text-gray-400">Total Minutes:</span>
                  <p className="text-white font-medium">{summary.totalMinutes}</p>
                </div>
                <div>
                  <span className="text-gray-400">Total Hours:</span>
                  <p className="text-white font-medium">{summary.totalHours}h {summary.remainingMinutes}m</p>
                </div>
              </div>
            </div>
          )}

          {/* Export Button - Bottom right */}
          {entries.length > 0 && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleExportToExcel}
                className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 
                  border border-white/10 hover:border-cyan-400/30 rounded-lg text-gray-300 hover:text-cyan-400 
                  transition-all duration-300 text-sm"
                title="Export to Excel"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// TimeSheet Entry Component
const TimeSheetEntry = ({ 
  entry, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  formatTime, 
  formatDate 
}) => {
  const [editData, setEditData] = useState({
    date: new Date(entry.date),
    timeMinutes: entry.timeMinutes.toString(),
    description: entry.description
  })

  const handleSave = () => {
    if (!editData.description.trim()) {
      toast.error('Description is required')
      return
    }
    
    if (!editData.timeMinutes || parseInt(editData.timeMinutes) <= 0) {
      toast.error('Please enter valid time in minutes')
      return
    }

    onSave({
      date: editData.date,
      timeMinutes: parseInt(editData.timeMinutes),
      description: editData.description.trim()
    })
  }

  const handleInputChange = (field, value) => {
    if (field === 'timeMinutes') {
      const numericValue = value.replace(/[^0-9]/g, '')
      setEditData(prev => ({ ...prev, [field]: numericValue }))
    } else {
      setEditData(prev => ({ ...prev, [field]: value }))
    }
  }

  if (isEditing) {
    return (
      <div className="bg-slate-900/50 rounded-lg p-3 border border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-[120px_90px_1fr_auto] gap-3 items-start">
          {/* Date - Same as form */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Date <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <DatePicker
                selected={editData.date}
                onChange={(date) => setEditData(prev => ({ ...prev, date }))}
                dateFormat="MMM dd"
                customInput={
                  <button
                    type="button"
                    className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-left text-sm
                      focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 
                      transition-all duration-300 backdrop-blur-xl hover:border-white/20 flex items-center justify-between"
                  >
                    <span className="text-white text-sm">
                      {editData.date ? editData.date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : 'Select'}
                    </span>
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </button>
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
              />
            </div>
          </div>
          
          {/* Time - Same as form */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Time (mins) <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              value={editData.timeMinutes}
              onChange={(e) => handleInputChange('timeMinutes', e.target.value)}
              placeholder="120"
              className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm
                focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 
                transition-all duration-300 backdrop-blur-xl hover:border-white/20"
            />
          </div>
          
          {/* Description - Textarea to show full text */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Description <span className="text-cyan-400">*</span>
            </label>
            <textarea
              value={editData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Work description"
              rows={2}
              className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white text-sm
                focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 
                transition-all duration-300 backdrop-blur-xl hover:border-white/20 resize-none"
            />
          </div>
          
          {/* Action buttons - Icons only */}
          <div className="flex flex-col justify-start pt-5">
            <div className="flex space-x-1">
              <button
                onClick={handleSave}
                title="Save changes"
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
              >
                <span className="text-lg leading-none">✓</span>
              </button>
              <button
                onClick={onCancel}
                title="Cancel"
                className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
              >
                <span className="text-lg leading-none">✕</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900/50 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-[120px_90px_1fr_auto] gap-3 items-center">
        {/* Date - Same width as form */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-white text-sm">{formatDate(entry.date)}</span>
        </div>
        
        {/* Time - Same width as form */}
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-white text-sm font-medium">{formatTime(entry.timeMinutes)}</span>
        </div>
        
        {/* Description - Expands to fill space */}
        <div className="flex items-center space-x-2 min-w-0 overflow-hidden">
          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="text-white text-sm truncate flex-1">{entry.description}</div>
        </div>
        
        {/* Action buttons - Same as form */}
        <div className="flex space-x-1 justify-end">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-400 hover:text-cyan-400 transition-colors rounded"
            title="Edit entry"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded"
            title="Delete entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimeSheet
