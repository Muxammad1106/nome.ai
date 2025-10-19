import { useCallback, useEffect } from 'react'

interface UseScrollToBottomOptions {
  threshold?: number
  onReachBottom?: () => void
  enabled?: boolean
}

export const useScrollToBottom = ({ threshold = 100, onReachBottom, enabled = true }: UseScrollToBottomOptions) => {
  const handleScroll = useCallback(() => {
    if (!enabled || !onReachBottom) {
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold

    if (isNearBottom) {
      onReachBottom()
    }
  }, [enabled, onReachBottom, threshold])

  useEffect(() => {
    if (!enabled) {
      return
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, enabled])

  // Return null since we don't need a ref for window scroll
  return null
}

export default useScrollToBottom
