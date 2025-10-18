export function auth() {
  return {
    headers: {
      Authorization: `Token ${localStorage.token}`
    }
  }
}
