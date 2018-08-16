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

export const guardInfiniteLoop = code => {
  if (!code.includes('while')) return true
  const whileBlocks = code.split('while').slice(1)
  // whileBlocks.forEach(block => {})
}

const codeSnippet =
  'let i = 0 \n let x = 0 \n while (x < 10) { x++ } while (x < 10) { i++ }'
