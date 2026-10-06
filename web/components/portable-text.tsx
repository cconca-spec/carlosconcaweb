type Block = RichBlock

export const blockText = (b: Block) => (b.children ?? []).map((c) => c.text ?? '').join('')

/** Párrafos de bloques de texto simples (los datos traen un solo span sin formato). */
export function Paragraphs({
  blocks,
  className,
}: {
  blocks: Block[] | null | undefined
  className?: string
}) {
  return (
    <>
      {(blocks ?? []).map((b) => (
        <p key={b._key} className={className}>
          <RichText block={b} />
        </p>
      ))}
    </>
  )
}

export type RichBlock = {
  _key: string
  markDefs?: { _key: string; _type: string; href?: string }[]
  children?: { _key?: string; text?: string; marks?: string[] }[]
}

/** Texto de un bloque con negrita, cursiva y enlaces (lo que usan los datos). */
export function RichText({ block }: { block: RichBlock }) {
  return (
    <>
      {(block.children ?? []).map((c, i) => {
        let node: React.ReactNode = c.text ?? ''
        for (const m of c.marks ?? []) {
          if (m === 'strong') node = <strong key={`${i}-s`} className="font-semibold">{node}</strong>
          else if (m === 'em') node = <em key={`${i}-e`}>{node}</em>
          else {
            const def = block.markDefs?.find((d) => d._key === m)
            if (def?.href)
              node = (
                <a key={`${i}-l`} href={def.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  {node}
                </a>
              )
          }
        }
        return <span key={c._key ?? i}>{node}</span>
      })}
    </>
  )
}
