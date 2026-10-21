import { Reveal } from './reveal'

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden className="size-full shrink-0">
      <path d="M6 18L18 6M8 6h10v10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Flecha ↗ que sale por la esquina y vuelve a entrar desde la opuesta (solo CSS). */
function AnimatedArrow() {
  const move =
    'absolute inset-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'
  return (
    <span className="relative block size-[clamp(2rem,3vw,2.75rem)] overflow-hidden" aria-hidden>
      <span className={`${move} group-hover:translate-x-full group-hover:-translate-y-full group-focus-visible:translate-x-full group-focus-visible:-translate-y-full motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0`}>
        <Arrow />
      </span>
      <span className={`${move} -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 motion-reduce:hidden`}>
        <Arrow />
      </span>
    </span>
  )
}

export function ContactCard({
  label,
  url,
  external,
  delay = 0,
}: {
  label: string
  url: string
  external: string
  delay?: number
}) {
  return (
    <li>
      <Reveal className="h-full" delay={delay}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-full min-h-[clamp(11rem,19vw,17rem)] flex-col justify-between gap-6 rounded-card bg-card p-[clamp(1.25rem,2.4vw,2.5rem)] transition-colors duration-200 hover:bg-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <AnimatedArrow />
          <span className="text-[clamp(1.25rem,1.9vw,1.75rem)] leading-snug text-balance">
            {label}
            <span className="sr-only"> {external}</span>
          </span>
        </a>
      </Reveal>
    </li>
  )
}
