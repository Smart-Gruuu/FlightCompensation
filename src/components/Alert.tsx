import { ReactNode } from 'react'
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'
import { clsx } from 'clsx'

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: ReactNode
  className?: string
}

export default function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const variants = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: Info,
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-800'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      textColor: 'text-green-800'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: AlertCircle,
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
      textColor: 'text-yellow-800'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: XCircle,
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      textColor: 'text-red-800'
    }
  }

  const config = variants[variant]
  const Icon = config.icon

  return (
    <div
      className={clsx(
        'p-4 border rounded-lg',
        config.bg,
        config.border,
        className
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon className={clsx('h-5 w-5 mt-0.5', config.iconColor)} />
        <div className="flex-1">
          {title && (
            <p className={clsx('font-medium mb-1', config.titleColor)}>{title}</p>
          )}
          <div className={clsx('text-sm', config.textColor)}>{children}</div>
        </div>
      </div>
    </div>
  )
}

