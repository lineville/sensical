const {scanForIllegalTokens} = require('../sanitize')

test('returns true if it contains no bad tokens', () => {
  expect(scanForIllegalTokens('')).toBe(true)
})

test('returns error if it contains a bad token', () => {
  expect(scanForIllegalTokens('function() => { alert(mischief)}')).toBe(false)
})

test('returns error if it contains a bad token', () => {
  expect(scanForIllegalTokens('function() => { eval(mischief)}')).toBe(false)
})

test('returns error if it contains a bad token', () => {
  expect(scanForIllegalTokens('function() => { process (mischief)}')).toBe(
    false
  )
})
