export const scanForIllegalTokens = code => {
  const illegalTokens = ['alert', 'eval', 'process', 'fs']
  let valid = true
  illegalTokens.forEach(token => {
    valid = valid && !code.includes(token)
  })
  return valid
}
export function limitEval(code, fnOnStop, optionalTimeout) {
  var id = Math.random() + 1,
    blob = new Blob(
      [
        'onmessage=function(a){a=a.data;postMessage({i:a.i+1});postMessage({r:eval.call(this,a.c),i:a.i})};'
      ],
      {type: 'text/javascript'}
    ),
    myWorker = new Worker(URL.createObjectURL(blob))

  function onDone() {
    URL.revokeObjectURL(blob)
    fnOnStop.apply(this, arguments)
  }

  myWorker.onmessage = function(data) {
    data = data.data
    if (data) {
      if (data.i === id) {
        id = 0
        onDone(true, data.r)
      } else if (data.i === id + 1) {
        setTimeout(function() {
          if (id) {
            myWorker.terminate()
            onDone(false)
          }
        }, optionalTimeout || 1000)
      }
    }
  }

  myWorker.postMessage({c: code, i: id})
}

export const guardInfiniteLoop = code => {
  limitEval(
    code,
    function(success, returnValue) {
      if (success) {
        return returnValue
      } else {
        return false
      }
    },
    3000
  )
}

const codeSnippet =
  'let i = 0 \n let x = 0 \n while (x < 10) { x++ } while (x < 10) { i++ }'

export default code => {
  if (!scanForIllegalTokens(code)) {
    return 'Error: Sorry... you are not permitted to use alert, eval, process or fs'
  } else if (!guardInfiniteLoop(code)) {
    return 'The code takes too long to run. Is there an infinite loop?'
  } else {
    return guardInfiniteLoop(code)
  }
}
