import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface StatsCardProps {
  value: string | number
  label: string
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  icon?: ReactNode
}

export default function StatsCard({ value, label, variant = 'default', icon }: StatsCardProps) {
  const variants = {
    default: 'bg-gray-50 border-gray-200 text-gray-700',
    primary: 'bg-blue-50 border-blue-200 text-blue-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    danger: 'bg-red-50 border-red-200 text-red-700'
  }

  return (
    <div className={clsx('card border', variants[variant])}>
      {icon && <div className="mb-2">{icon}</div>}
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm">{label}</div>
    </div>
  )
}

