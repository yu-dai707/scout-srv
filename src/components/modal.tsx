'use client'

type ModalProps = {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onClose: () => void
  danger?: boolean
}

export default function Modal({
  open,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-3 text-lg font-bold">{title}</h2>

        <p className="mb-6 whitespace-pre-wrap text-sm text-slate-700">
          {message}
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded border px-4 py-2 text-sm hover:bg-slate-50"
          >
            {cancelText}
          </button>

          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`rounded px-4 py-2 text-sm text-white ${
                danger ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
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
