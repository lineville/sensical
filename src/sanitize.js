export const scanForIllegalTokens = code => {
  const illegalTokens = ['alert', 'eval', 'process', 'fs']
  let valid = true
  illegalTokens.forEach(token => {
    valid = valid && !code.includes(token)
  })
  if (valid) {
    return true
  } else {
    return 'Error: Sorry... you are not permitted to use alert, eval, process or fs'
  }
}
