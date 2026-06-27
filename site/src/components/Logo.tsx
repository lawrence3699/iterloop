interface LogoProps {
  className?: string
}

/**
 * iterloop mark — two overlapping rings: two AIs converging into one loop.
 * Uses currentColor so it inherits text color in the navbar/footer.
 */
export function Logo({ className = '' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="none"
      stroke="currentColor"
      strokeWidth={18}
      className={className}
      aria-hidden="true"
    >
      <circle cx="96" cy="128" r="62" />
      <circle cx="160" cy="128" r="62" />
    </svg>
  )
}
