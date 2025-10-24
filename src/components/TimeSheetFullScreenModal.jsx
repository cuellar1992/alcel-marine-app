/**
 * TimeSheet Full Screen Modal
 * Modal independiente de pantalla completa para visualizar y editar time sheets
 */

import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from './ui'
import TimeSheet from './ui/TimeSheet'

export default function TimeSheetFullScreenModal({ isOpen, onClose, claimId, claimInfo }) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-gray-900/95 backdrop-blur-sm">
      <div className="min-h-screen p-4">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 mb-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Time Sheet</h2>
              {claimInfo && (
                <p className="text-gray-400 mt-1">
                  {claimInfo.jobNumber} - {claimInfo.claimName}
                </p>
              )}
            </div>
            <Button
              variant="secondary"
              onClick={onClose}
              className="!p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* TimeSheet Content - Always expanded in full screen */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <TimeSheet
              claimId={claimId}
              isVisible={true}
              forceExpanded={true}
              hideHeader={true}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={onClose} className="px-8">
            Close
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
