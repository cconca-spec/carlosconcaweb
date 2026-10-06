type Person = { _key: string; name?: string | null; year?: string | null; position?: string | null; country?: string | null }

const format = (p: Person) =>
  `${p.name ?? ''}${p.year ? ` (${p.year})` : ''}${p.position ? `; ${p.position}` : ''}${p.country ? `, ${p.country}` : ''}`

/** Lista de personas, una por línea con guion (como en el WordPress). */
export function PeopleList({ people }: { people: Person[] }) {
  return (
    <ul className="flex flex-col gap-2 text-sm leading-snug">
      {people.map((p) => (
        <li key={p._key}>– {format(p)}</li>
      ))}
    </ul>
  )
}

/** Lista en línea separada por " | " (ingenieros y magísteres). */
export function InlinePeople({ people }: { people: Person[] }) {
  return (
    <p className="text-sm leading-relaxed">
      {people.map((p, i) => (
        <span key={p._key}>
          {i > 0 && ' | '}
          {format(p)}
        </span>
      ))}
    </p>
  )
}
