import React, { forwardRef, InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  inputType: 'text' | 'number' | 'password' | 'email'
  isDecimalPoint?: boolean
  min?: number
  max?: number
}

const InputComponent = forwardRef<HTMLInputElement, Props>(
  (
    {
      inputType,
      isDecimalPoint,
      onChange,
      min = Number.MIN_SAFE_INTEGER,
      max = Number.MAX_SAFE_INTEGER,
      ...rest
    },
    ref,
  ) => {
    const validateNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value

      if (inputType === 'number') {
        // Remove non-numeric characters except for the decimal point
        value = value.replace(/[^0-9.-]/g, '')

        // Remove extra minus signs except the first one
        const parts = value.split('-')
        if (parts.length > 2) {
          value = parts[0] + '-' + parts.slice(1).join('')
        }

        if (isDecimalPoint) {
          // Allow only one decimal point
          const decimalParts = value.split('.')
          value = decimalParts[0] // Initialize with integer part

          if (decimalParts.length > 1) {
            // Append decimal point and decimal part (up to two digits)
            value += '.' + decimalParts.slice(1).join('').substring(0, 2)
          }
        } else {
          // If decimal points are not allowed, remove them
          value = value.replace(/\./g, '')
        }

        // Ensure sign (+/-) can only appear at the beginning
        if (value.startsWith('-')) {
          value = '-' + value.slice(1).replace(/-/g, '') // Remove additional minus signs
        } else {
          value = value.replace(/-/g, '') // Remove all minus signs except the first one
        }

        // Convert value to number for comparison with min and max
        const numericValue = parseFloat(value)

        // Check against min and max
        if (!isNaN(numericValue)) {
          if (numericValue < min) {
            value = min.toString() // Apply min value if current value is less than min
          }
          if (numericValue > max) {
            value = max.toString() // Apply max value if current value is greater than max
          }
        }
      }

      e.target.value = value
      if (onChange) {
        onChange(e)
      }
    }

    return (
      <input
        {...rest}
        ref={ref}
        type={inputType === 'number' ? 'text' : inputType}
        onChange={validateNumberInput}
      />
    )
  },
)

export default InputComponent
