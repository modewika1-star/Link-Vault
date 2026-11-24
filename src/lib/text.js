import { useCallback } from 'react'

export function formatText(message, variables = {}) {
  const template = String(message ?? '')
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(variables, key) ? String(variables[key]) : match,
  )
}

export function useText() {
  const t = useCallback(formatText, [])
  return { t }
}
