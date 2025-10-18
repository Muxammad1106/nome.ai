import { useEffect, useRef, useState, useCallback } from 'react'

import { BACKEND_API } from '@/utils/request'

interface UseWebSocketPersonEventsProps {
  onConnect?: () => void
  onMessage?: (data: any) => void
  onClose?: () => void
  onError?: (error: Event) => void
  autoReconnect?: boolean
  reconnectInterval?: number
}

interface UseWebSocketPersonEventsReturn {
  isConnected: boolean
  error: string | null
  sendMessage: (message: string) => void
  reconnect: () => void
  disconnect: () => void
}

const url = BACKEND_API.replace('http', 'ws') + '/ws/person/'

export const useWebSocketPersonEvents = ({
  onConnect,
  onMessage,
  onClose,
  onError,
  autoReconnect = true,
  reconnectInterval = 3000
}: UseWebSocketPersonEventsProps): UseWebSocketPersonEventsReturn => {
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      const socket = new WebSocket(url)

      socketRef.current = socket

      socket.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setError(null)
        onConnect?.()
      }

      socket.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data)

          console.log('Received person event:', data)
          onMessage?.(data)
        } catch (parseError) {
          console.error('Error parsing WebSocket message:', parseError)
          setError('Failed to parse received data')
        }
      }

      socket.onclose = event => {
        console.log('WebSocket disconnected', event.code, event.reason)
        setIsConnected(false)
        onClose?.()

        // Auto-reconnect if enabled and not a normal closure
        if (autoReconnect && event.code !== 1000) {
          console.log('Attempting to reconnect...')
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }

      socket.onerror = error => {
        console.error('WebSocket error:', error)
        setError('WebSocket connection error')
        onError?.(error)
      }
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err)
      setError('Failed to create WebSocket connection')
    }
  }, [onConnect, onMessage, onClose, onError, autoReconnect, reconnectInterval])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (socketRef.current) {
      socketRef.current.close(1000, 'Manual disconnect')

      socketRef.current = null
    }

    setIsConnected(false)
  }, [])

  const reconnect = useCallback(() => {
    disconnect()

    setTimeout(connect, 100)
  }, [disconnect, connect])

  const sendMessage = useCallback((message: string) => {
    const socket = socketRef.current

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not connected')

      return false
    }

    try {
      socket.send(message)

      return true
    } catch (err) {
      console.error('Failed to send message:', err)
      setError('Failed to send message')

      return false
    }
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const socket = socketRef.current

        if (!socket || socket.readyState === WebSocket.CLOSED) {
          console.log('Tab focused — reconnecting WebSocket')

          connect()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [connect])

  // Initial connection
  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }

      disconnect()
    }
  }, [connect, disconnect])

  return {
    isConnected,
    error,
    sendMessage,
    reconnect,
    disconnect
  }
}
