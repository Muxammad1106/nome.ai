# Infinite Scroll Hooks

This directory contains custom hooks for implementing infinite scroll functionality in React components.

## useInfiniteScrollRequest

A hook for handling infinite scroll pagination with API requests.

### Usage

```typescript
import useInfiniteScrollRequest from '@/hooks/useInfiniteScrollRequest'

const MyComponent = () => {
  const {
    data,
    loading,
    loadingMore,
    loadMore,
    hasNextPage,
    reset
  } = useInfiniteScrollRequest<MyDataType>(
    { url: '/api/my-endpoint' },
    { pageSize: 20 }
  )

  return (
    <div>
      {data?.results.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      {loadingMore && <div>Loading more...</div>}
    </div>
  )
}
```

### API Response Format

The hook expects your API to return data in this format:

```json
{
  "count": 100,
  "results": [...],
  "has_next": true,
  "total_pages": 10
}
```

## useScrollToBottom

A hook for detecting when the user has scrolled near the bottom of a container.

### Usage

```typescript
import { useScrollToBottom } from '@/hooks/useScrollToBottom'

const MyComponent = () => {
  const scrollRef = useScrollToBottom({
    threshold: 200,
    onReachBottom: () => console.log('Reached bottom!'),
    enabled: true
  })

  return (
    <div ref={scrollRef} style={{ height: '400px', overflow: 'auto' }}>
      {/* Your scrollable content */}
    </div>
  )
}
```

### Parameters

- `threshold`: Distance from bottom to trigger callback (default: 100px)
- `onReachBottom`: Callback function when bottom is reached
- `enabled`: Whether scroll detection is active (default: true)

## Complete Example

```typescript
import { useCallback } from 'react'
import useInfiniteScrollRequest from '@/hooks/useInfiniteScrollRequest'
import { useScrollToBottom } from '@/hooks/useScrollToBottom'

const InfiniteScrollList = () => {
  const {
    data,
    loading,
    loadingMore,
    loadMore,
    hasNextPage
  } = useInfiniteScrollRequest<PersonType>(
    { url: '/api/persons/list/' },
    { pageSize: 20 }
  )

  const scrollRef = useScrollToBottom({
    threshold: 200,
    onReachBottom: loadMore,
    enabled: hasNextPage && !loadingMore
  })

  return (
    <div
      ref={scrollRef}
      style={{ height: '500px', overflow: 'auto' }}
    >
      {data?.results.map(person => (
        <PersonCard key={person.id} person={person} />
      ))}
      
      {loadingMore && <div>Loading more...</div>}
      {!hasNextPage && <div>End of list</div>}
    </div>
  )
}
```
