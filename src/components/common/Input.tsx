'use client'

import {
  ChangeEvent,
  InputHTMLAttributes,
  MouseEvent,
  TextareaHTMLAttributes,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/utils/cn'
import CloseEye from '@/assets/close-eye.svg'
import OpenEye from '@/assets/open-eye.svg'
import InputCalender from '@/assets/input-calender.svg'

/** HTML input 에서 사용할 수 있는 타입들 */
type InputType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week'

interface CommonProps {
  id: string
  label?: string
  errorMessage?: string
  className?: string
}

/** 일반 input 전용 props (HTML type 사용 가능) */
type InputProps = CommonProps & {
  variant: 'input'
  type?: InputType
} & InputHTMLAttributes<HTMLInputElement>

/** textarea 전용 */
type TextareaProps = CommonProps & {
  variant: 'textarea'
  height?: string
} & TextareaHTMLAttributes<HTMLTextAreaElement>

/** 드롭다운 전용 (표시/선택은 input(button) + 리스트) */
type DropdownProps = CommonProps & {
  variant: 'dropdown'
  items: string[]
  maxHeight?: string
  onDropdownSelect?: (index: number) => void
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'type'>

/** 커스텀 날짜 전용 (보이는 건 텍스트, 실제는 숨겨진 date input) */
type DateCustomProps = CommonProps & {
  variant: 'date-custom'
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder' | 'type'>

type Props = InputProps | TextareaProps | DropdownProps | DateCustomProps

/* ------------------------ styles ------------------------ */

const COMMON_STYLE = cn(
  'h-54 w-full rounded-2xl bg-white border border-gray-100 px-19 py-15 outline-none',
  'txt-16_M leading-19 placeholder:text-gray-400 text-start'
)

const FOCUS_STYLE = cn(
  'focus:border-primary-500 focus:border-[1.5px]',
  'focus:px-18.5 focus:py-14.5'
)

const SCROLLBAR_STYLE = cn(
  '[&::-webkit-scrollbar]:w-3',
  '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200',
  '[&::-webkit-scrollbar-button]:hidden'
)

/* ------------------------ main ------------------------ */

export default function Input({ className = '', label, errorMessage, ...props }: Props) {
  const insideInput = () => {
    const base = cn(
      'text-gray-950',
      COMMON_STYLE,
      FOCUS_STYLE,
      errorMessage ? 'border-red-500' : ''
    )

    switch (props.variant) {
      case 'dropdown':
        return <DropdownInput className={cn(COMMON_STYLE, FOCUS_STYLE)} {...props} />
      case 'textarea':
        return <TextareaInput className={base} {...props} />
      case 'date-custom':
        return <DateCustomInput className={base} {...props} />
      case 'input': {
        // input 변형 중 password만 별도 처리
        if (props.type === 'password') {
          return <PasswordInput className={base} {...props} />
        }
        return <input className={base} {...props} />
      }
    }
  }

  // dropdown은 내부에서 자체 에러 처리할 수도 있으니 기존 로직 유지
  const showError = props.variant !== 'dropdown' && !!errorMessage

  return (
    <div className={'flex flex-col gap-10 ' + className}>
      {label && (
        <label className="txt-16_M leading-19 text-gray-950" htmlFor={props.id}>
          {label}
        </label>
      )}
      <div className="relative flex flex-col gap-6">
        {insideInput()}
        <div className="mx-8">
          <p
            // 스크린리더에선 에러가 생길 때만 읽히도록 처리
            aria-live={showError ? 'assertive' : 'off'}
            role={showError ? 'alert' : undefined}
            className={cn(
              'txt-12_M leading-14 transition-opacity duration-150',
              'min-h-14',
              showError ? 'text-red-500 opacity-100' : 'opacity-0'
            )}
          >
            {errorMessage ?? ''} {/* 내용이 없어도 높이는 유지 */}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------ sub components ------------------------ */

function DropdownInput({
  className,
  onClick,
  defaultValue,
  placeholder,
  items,
  maxHeight = '280px',
  onDropdownSelect,
  ...props
}: DropdownProps & { className?: string }) {
  const [value, setValue] = useState<{ item: string; key: string }>({ item: '', key: '' })
  const [isOpen, setIsOpen] = useState(false)

  // items 변경될 때마다 key 재생성
  const elements = useMemo(() => items.map((item) => ({ item, key: crypto.randomUUID() })), [items])

  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setIsOpen(false))

  const handleClick = (e: MouseEvent<HTMLInputElement>) => {
    setIsOpen((prev) => !prev)
    onClick?.(e)
  }

  return (
    <div ref={ref} className="relative">
      <input
        className={cn(
          className,
          value.item || defaultValue ? 'text-gray-950' : 'text-gray-400',
          'truncate pr-43 focus:pr-42.5'
        )}
        type="button"
        value={value.item || (defaultValue ?? placeholder ?? '')}
        onClick={handleClick}
        {...props}
      />
      {/* 오른쪽 아이콘 영역 (버튼 역할) */}
      <button
        type="button"
        className="absolute top-15 right-20 h-24 w-24"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="열기"
      />
      {isOpen && (
        <div
          className={cn(
            'absolute top-64 z-10 w-full rounded-2xl border border-gray-100 bg-white px-8 py-11',
            'shadow-[0_2px_6px_rgba(0,0,0,0.02)]'
          )}
        >
          <div
            className={cn('flex flex-col gap-4 overflow-y-auto pl-3', SCROLLBAR_STYLE)}
            style={{
              maxHeight: `calc(${maxHeight} - 24px)`,
              scrollbarGutter: 'stable',
            }}
          >
            {elements.map((element, index) => (
              <button
                key={element.key}
                className={cn(
                  'txt-16_M rounded-xl px-20 py-16 text-start leading-none wrap-break-word text-gray-900',
                  element.key === value.key && 'bg-primary-100'
                )}
                type="button"
                onClick={() => {
                  setValue(element)
                  setIsOpen(false)
                  onDropdownSelect?.(index)
                }}
              >
                {element.item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TextareaInput({ className, height, ...props }: TextareaProps & { className?: string }) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <label
      className={cn(
        className,
        isFocused ? 'border-primary-500 border-[1.5px] px-[15.5px] py-[14.5px]' : 'px-[16px]'
      )}
      style={{ height }}
    >
      <textarea
        className={cn('block h-full w-full resize-none pl-3 outline-none', SCROLLBAR_STYLE)}
        style={{ scrollbarGutter: 'stable' }}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        {...props}
      />
    </label>
  )
}

function PasswordInput({
  className,
  ...props
}: Omit<InputProps, 'variant'> & { className?: string }) {
  const [isPassword, setIsPassword] = useState(true)

  return (
    <>
      <input
        {...props}
        type={isPassword ? 'password' : 'text'}
        className={cn(className, 'pr-40')}
      />
      <button
        className="absolute top-15 right-20 text-gray-400"
        type="button"
        onClick={() => setIsPassword((prev) => !prev)}
        aria-label={isPassword ? '비밀번호 보기' : '비밀번호 숨기기'}
      >
        {isPassword ? <CloseEye className="w-24 h-24" /> : <OpenEye className="w-24 h-24" />}
      </button>
    </>
  )
}

function DateCustomInput({
  className,
  onChange,
  ...props
}: DateCustomProps & { className?: string }) {
  const textRef = useRef<HTMLInputElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)

  const handleInputClick = () => {
    // 입력 필드 클릭 시에도 날짜 선택기 열기
    if (dateRef.current) {
      if (typeof dateRef.current.showPicker === 'function') {
        dateRef.current.showPicker()
      } else {
        dateRef.current.click()
      }
    }
  }

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    // 선택된 날짜를 yy/mm/dd 형식으로 표시
    if (textRef.current && dateValue) {
      textRef.current.value = dateValue.replaceAll('-', '/').slice(2)
    } else if (textRef.current && !dateValue) {
      textRef.current.value = ''
    }
    onChange?.(e)
  }

  return (
    <div className={cn('relative', className)}>
      {/* 보이는 텍스트 입력 (readOnly, 클릭 시 날짜 선택기 열림) */}
      <input
        ref={textRef}
        readOnly
        placeholder="날짜를 선택하세요"
        onClick={handleInputClick}
        onKeyDown={(e) => {
          // 키보드 입력 방지 (Tab, Enter는 허용)
          if (e.key !== 'Tab' && e.key !== 'Enter') {
            e.preventDefault()
          }
          // Enter 키로도 날짜 선택기 열기
          if (e.key === 'Enter') {
            e.preventDefault()
            handleInputClick()
          }
        }}
        className="cursor-pointer"
        {...props}
      />

      {/* 우측 날짜 선택 버튼 */}
      <div className="absolute top-15 right-20 bottom-15 w-24">
        <div className="relative size-full flex items-center justify-center">
          <InputCalender className="w-24 h-24 pointer-events-none" />
          <input
            ref={dateRef}
            className="absolute inset-0 opacity-0 cursor-pointer"
            max="2099-12-31"
            min="2000-01-01"
            type="date"
            onChange={handleDateChange}
          />
        </div>
      </div>
    </div>
  )
}
