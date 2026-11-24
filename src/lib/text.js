export function formatText(message, variables = {}) {
  const template = String(message ?? '')

  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(variables, key)
      ? String(variables[key])
      : match
  })
}
