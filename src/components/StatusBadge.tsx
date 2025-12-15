import { ClaimStatus } from '../types'
import { getStatusColor } from '../utils/eu261'
import { clsx } from 'clsx'

interface StatusBadgeProps {
  status: ClaimStatus | string
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'px-3 py-1 rounded-full text-xs font-medium',
        getStatusColor(status),
        className
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}

