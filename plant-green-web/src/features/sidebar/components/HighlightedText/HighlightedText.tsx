import { highlightMatch } from '../../utils/highlightMatch'
import './HighlightedText.css'

interface HighlightedTextProps {
  label: string
  query: string
}

export function HighlightedText({ label, query }: HighlightedTextProps) {
  return <>{highlightMatch(label, query)}</>
}
