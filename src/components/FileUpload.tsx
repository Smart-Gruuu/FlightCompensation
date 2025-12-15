import { useState } from 'react'
import { Upload, FileText, X } from 'lucide-react'

interface FileUploadProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  accept?: string
  maxSize?: number // in bytes
  multiple?: boolean
}

export default function FileUpload({
  files,
  onFilesChange,
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx',
  maxSize = 10485760, // 10MB default
  multiple = true
}: FileUploadProps) {
  const [error, setError] = useState<string>('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    if (!e.target.files) return

    const newFiles = Array.from(e.target.files)
    const validFiles: File[] = []
    const errors: string[] = []

    newFiles.forEach((file) => {
      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds maximum size of ${(maxSize / 1024 / 1024).toFixed(0)}MB`)
        return
      }
      validFiles.push(file)
    })

    if (errors.length > 0) {
      setError(errors.join(', '))
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    onFilesChange(newFiles)
  }

  return (
    <div>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <label htmlFor="file-upload" className="cursor-pointer inline-block">
          <span className="btn btn-outline">
            Choose Files
          </span>
          <input
            id="file-upload"
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
        <p className="mt-2 text-sm text-gray-600">
          Upload boarding pass, booking confirmation, or other relevant documents
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Accepted: PDF, JPG, PNG, DOC, DOCX (Max {(maxSize / 1024 / 1024).toFixed(0)}MB per file)
        </p>
      </div>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-gray-700">Uploaded Files:</h3>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024).toFixed(2)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-600 hover:text-red-700"
                aria-label="Remove file"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

