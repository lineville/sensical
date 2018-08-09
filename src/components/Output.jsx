import React, {Component} from 'react'
import Terminal from 'terminal-in-react'
import NodeEvalPlugin from 'terminal-in-react-node-eval-plugin'
import pseudoFileSystemPlugin from 'terminal-in-react-pseudo-file-system-plugin'
const FileSystemPlugin = pseudoFileSystemPlugin()

class Output extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output: ''
    }
    this.run = this.run.bind(this)
  }

  run() {
    const {input} = this.props
    console.log(eval(input))
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <Terminal
          color="green"
          backgroundColor="black"
          barColor="black"
          watchConsoleLogging={true}
          style={{fontWeight: 'bold', fontSize: '1em'}}
          msg="Output"
          commands={{run: this.run}}
          startState="maximised"
          plugins={[
            FileSystemPlugin,
            {
              class: NodeEvalPlugin,
              config: {
                filesystem: FileSystemPlugin.displayName
              }
            }
          ]}
        />
      </div>
    )
  }
}

export default Output

{
  /* <span>
  <p>Output</p>
  <button type="submit" onClick={this.run}>
    Run
  </button>
</span>
<p className="terminal-output">>_ {this.state.output}</p> */
}
