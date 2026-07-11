export const getLocalStorageObject = <T>(key: string): T | null => {
  const value = localStorage.getItem(key)
  return value ? (JSON.parse(value) as T) : null
}

export const getLocalStorage = (key: string) => {
  return localStorage.getItem(key)
}

export const setLocalStorageObject = (key: string, object: unknown) => {
  return localStorage.setItem(key, JSON.stringify(object))
}

export const setLocalStorage = (key: string, data: string) => {
  return localStorage.setItem(key, data)
}

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key)
}
