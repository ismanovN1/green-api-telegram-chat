import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base: IconProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true,
}

export function SendIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10.1 15 12 3.4 13.9z" />
    </svg>
  )
}

export function BackIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z" />
    </svg>
  )
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 17v-3H3v-4h7V7l5 5-5 5zm9-14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7v-2h7V5h-7V3h7z" />
    </svg>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
    </svg>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 16 16" {...props}>
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm0 1.3a5.2 5.2 0 1 1 0 10.4A5.2 5.2 0 0 1 8 2.8zm-.6 1.7v4.1l3.2 1.9.6-1-2.6-1.6V4.5z" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 16 16" {...props}>
      <path d="m5.6 11.4-3.3-3.3 1-1 2.3 2.3 6.6-6.6 1 1z" />
    </svg>
  )
}

export function ErrorIcon(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 16 16" {...props}>
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM7.3 4h1.4v5H7.3zm0 6.3h1.4v1.4H7.3z" />
    </svg>
  )
}

export function TelegramLogo(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 240 240" fill="none" {...props}>
      <circle cx="120" cy="120" r="120" fill="#3390ec" />
      <path
        fill="#fff"
        d="M54.3 118.8c35-15.2 58.3-25.3 70-30.2 33.3-13.9 40.3-16.3 44.8-16.4 1 0 3.2.2 4.7 1.4 1.2 1 1.5 2.3 1.7 3.3.2 1 .4 3.1.2 4.7-1.8 19-9.6 65.1-13.6 86.3-1.7 9-5 12-8.2 12.3-7 .6-12.3-4.6-19-9-10.6-6.9-16.5-11.2-26.8-18-11.9-7.8-4.2-12.1 2.6-19.1 1.8-1.8 32.5-29.8 33.1-32.3.1-.3.1-1.5-.6-2.1-.7-.6-1.7-.4-2.5-.2-1.1.2-17.9 11.4-50.6 33.5-4.8 3.3-9.1 4.9-13 4.8-4.3-.1-12.5-2.4-18.6-4.4-7.5-2.4-13.5-3.7-12.9-7.9.3-2.2 3.3-4.4 8.9-6.7z"
      />
    </svg>
  )
}
