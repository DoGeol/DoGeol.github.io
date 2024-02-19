import React, { forwardRef, memo, PropsWithChildren, Ref } from 'react'

type TInputProps = {
  wrapperClass?: string
  inputClass?: string
}
export default memo(
  forwardRef<HTMLInputElement, TInputProps>(function DInput(
    { ...props }: PropsWithChildren<TInputProps>,
    ref: Ref<HTMLInputElement>,
  ): React.JSX.Element {
    const { wrapperClass, inputClass } = props
    const wrapperClasses = [wrapperClass].filter((w) => !!w)
    const inputClasses = [inputClass, ''].filter((w) => !!w)

    return (
      <div className={`${wrapperClasses}`}>
        <input ref={ref} className={`${inputClasses}`} />
      </div>
    )
  }),
)
