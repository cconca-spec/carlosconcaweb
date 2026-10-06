type Block = { _key: string; children?: { text?: string }[] }

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
          {blockText(b)}
        </p>
      ))}
    </>
  )
}
