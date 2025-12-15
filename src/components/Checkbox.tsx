import { InputHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  error?: string
}

export default function Checkbox({ label, error, className, ...props }: CheckboxProps) {
  return (
    <div>
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          className={clsx(
            'mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500',
            error && 'border-red-300',
            className
          )}
          {...props}
        />
        <label htmlFor={props.id} className="text-sm text-gray-700">
          {label}
        </label>
      </div>
      {error && (
        <p className="text-red-600 text-sm mt-1 ml-7">{error}</p>
      )}
    </div>
  )
}

