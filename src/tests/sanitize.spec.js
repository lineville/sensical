const {scanForIllegalTokens} = require('../sanitize')

test('returns true if it contains no bad tokens', () => {
  expect(scanForIllegalTokens('')).toBe(true)
})

test('returns error if it contains a bad token', () => {
  expect(scanForIllegalTokens('function() => { alert(mischief)}')).toBe(
    'Error: Sorry... you are not permitted to use alert, eval, process or fs'
  )
})

test('returns error if it contains a bad token', () => {
  expect(scanForIllegalTokens('function() => { eval(mischief)}')).toBe(
    'Error: Sorry... you are not permitted to use alert, eval, process or fs'
  )
})

test('returns error if it contains a bad token', () => {
  expect(scanForIllegalTokens('function() => { process (mischief)}')).toBe(
    'Error: Sorry... you are not permitted to use alert, eval, process or fs'
  )
})
