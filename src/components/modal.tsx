'use client'

type ModalProps = {
  open?: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onClose: () => void
  danger?: boolean
}

export default function Modal({
  open = true,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'キャンセル',
  onConfirm,
  onClose,
  danger = false,
}: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transform transition-all">
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        </div>

        <p className="mb-8 whitespace-pre-wrap text-slate-600 leading-relaxed">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-slate-700 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            {cancelText}
          </button>

          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-all ${
                danger 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:shadow-lg hover:scale-105' 
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:shadow-lg hover:scale-105'
              }`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
