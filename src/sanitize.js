export const hasBadTokens = code => {
  const illegalTokens = ['alert', 'eval', 'process', 'fs']
  let valid = true
  illegalTokens.forEach(token => {
    valid = valid && !code.includes(token)
  })
  return !valid
}
// Testing out travis build

function limitEval(code, fnOnStop, timeOut) {
  if (hasBadTokens(code)) {
    return 'Sorry... you are not permitted to user eval, alert, process or fs.'
  }
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
        }, timeOut || 1000)
      }
    }
  }

  myWorker.onerror = function(error) {
    console.log(error.message)
    onDone(false, error.message)
  }

  myWorker.postMessage({c: code, i: id})
}

export default limitEval
