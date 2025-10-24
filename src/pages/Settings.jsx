import { useState, useEffect } from 'react'
import { Shield, Key, Download, AlertCircle, CheckCircle2, X } from 'lucide-react'
import Container from '../components/ui/Container'
import { twoFactorAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function Settings() {
  const [twoFactorStatus, setTwoFactorStatus] = useState({
    enabled: false,
    backupCodesRemaining: 0
  })
  const [loading, setLoading] = useState(true)
  const [qrCodeData, setQrCodeData] = useState(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [disablePassword, setDisablePassword] = useState('')
  const [showQRSetup, setShowQRSetup] = useState(false)
  const [showDisableModal, setShowDisableModal] = useState(false)
  const [backupCodes, setBackupCodes] = useState([])

  useEffect(() => {
    loadTwoFactorStatus()
  }, [])

  const loadTwoFactorStatus = async () => {
    try {
      setLoading(true)
      const response = await twoFactorAPI.getStatus()
      if (response.success) {
        setTwoFactorStatus(response.data)
      }
    } catch (error) {
      console.error('Error loading 2FA status:', error)
      toast.error('Error loading 2FA status')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateQR = async () => {
    try {
      const response = await twoFactorAPI.generateSecret()
      if (response.success) {
        setQrCodeData(response.data)
        setShowQRSetup(true)
        toast.success('Scan the QR code with your authenticator app')
      }
    } catch (error) {
      console.error('Error generating QR:', error)
      toast.error(error.message || 'Error generating QR code')
    }
  }

  const handleEnable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }

    try {
      const response = await twoFactorAPI.enable(verificationCode)
      if (response.success) {
        setBackupCodes(response.data.backupCodes)
        setShowQRSetup(false)
        setVerificationCode('')
        setQrCodeData(null)
        await loadTwoFactorStatus()
        toast.success('2FA enabled successfully!')
      }
    } catch (error) {
      console.error('Error enabling 2FA:', error)
      toast.error(error.message || 'Invalid verification code')
    }
  }

  const handleDisable2FA = async () => {
    if (!disablePassword) {
      toast.error('Please enter your password')
      return
    }

    try {
      const response = await twoFactorAPI.disable(disablePassword)
      if (response.success) {
        setShowDisableModal(false)
        setDisablePassword('')
        await loadTwoFactorStatus()
        toast.success('2FA disabled successfully')
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error)
      toast.error(error.message || 'Invalid password')
    }
  }

  const downloadBackupCodes = () => {
    const text = backupCodes.join('\n')
    const blob = new Blob([`Alcel Marine - 2FA Backup Codes\n\n${text}\n\nKeep these codes safe. Each code can only be used once.`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'alcel-marine-backup-codes.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account security and preferences</p>
        </div>

        {/* Security Section */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">Security</h2>
          </div>

          {/* 2FA Section */}
          <div className="bg-slate-900/50 rounded-lg p-6 border border-white/5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-medium text-white">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {twoFactorStatus.twoFactorEnabled ? (
                  <span className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Enabled
                  </span>
                ) : (
                  <span className="flex items-center gap-2 px-3 py-1 bg-gray-500/10 border border-gray-500/20 rounded-full text-gray-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Disabled
                  </span>
                )}
              </div>
            </div>

            {!twoFactorStatus.twoFactorEnabled ? (
              <div className="mt-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-300">
                    <strong>Recommended:</strong> Enable 2FA to protect your account with an additional security layer.
                    You'll need to enter a code from your authenticator app each time you sign in.
                  </p>
                </div>
                <button
                  onClick={handleGenerateQR}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                >
                  Enable Two-Factor Authentication
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-4">
                  <div>
                    <p className="text-sm text-gray-300">Backup Codes Remaining</p>
                    <p className="text-2xl font-bold text-white">{twoFactorStatus.backupCodesRemaining}</p>
                  </div>
                  {twoFactorStatus.backupCodesRemaining < 3 && (
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
                <button
                  onClick={() => setShowDisableModal(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Disable Two-Factor Authentication
                </button>
              </div>
            )}
          </div>
        </div>

        {/* QR Setup Modal */}
        {showQRSetup && qrCodeData && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-white/10 rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Setup Two-Factor Authentication</h3>
                <button
                  onClick={() => {
                    setShowQRSetup(false)
                    setQrCodeData(null)
                    setVerificationCode('')
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-300 mb-4">
                    1. Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>
                  <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                    <img src={qrCodeData.qrCode} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-300 mb-2">Or enter this code manually:</p>
                  <div className="bg-slate-800 border border-white/10 rounded px-3 py-2">
                    <code className="text-cyan-400 text-sm font-mono break-all">{qrCodeData.secret}</code>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    2. Enter the 6-digit code from your authenticator app:
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white text-center text-2xl tracking-widest
                      focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                    maxLength={6}
                  />
                </div>

                <button
                  onClick={handleEnable2FA}
                  disabled={verificationCode.length !== 6}
                  className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 disabled:cursor-not-allowed
                    text-white rounded-lg transition-colors font-medium"
                >
                  Verify and Enable 2FA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Disable 2FA Modal */}
        {showDisableModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-white/10 rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-white mb-4">Disable Two-Factor Authentication</h3>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-300">
                  <strong>Warning:</strong> Disabling 2FA will make your account less secure.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-2">Enter your password to confirm:</label>
                <input
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white
                    focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDisableModal(false)
                    setDisablePassword('')
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisable2FA}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Disable 2FA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Backup Codes Modal */}
        {backupCodes.length > 0 && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-white/10 rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Backup Codes</h3>
                <button
                  onClick={() => setBackupCodes([])}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-300">
                  <strong>Important:</strong> Save these backup codes in a safe place.
                  Each code can only be used once to access your account if you lose your authenticator device.
                </p>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="bg-slate-800 rounded px-3 py-2">
                      <code className="text-cyan-400 text-sm font-mono">{code}</code>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={downloadBackupCodes}
                className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors
                  font-medium flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Backup Codes
              </button>
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}
