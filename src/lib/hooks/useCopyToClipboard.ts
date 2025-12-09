import { useToast } from '@/components/ui/toast'

export function useCopyToClipboard() {
  const { showToast } = useToast()

  const copy = async (text: string, label: string = 'Text') => {
    try {
      await navigator.clipboard.writeText(text)
      showToast(`${label} copied to clipboard!`, 'success')
      return true
    } catch (err) {
      showToast(`Failed to copy ${label.toLowerCase()}`, 'error')
      return false
    }
  }

  return { copy }
}
