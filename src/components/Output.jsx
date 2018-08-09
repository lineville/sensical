import React, {Component} from 'react'

class Output extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output1: '',
      output2: ''
    }
    this.run1 = this.run1.bind(this)
    this.run2 = this.run2.bind(this)
  }

  run1() {
    const {input1} = this.props
    console.log(input1)
    this.setState({
      output1: eval(input1)
    })
    console.log(this.state.output1)
  }
  run2() {
    const {input2} = this.props
    console.log(input2)
    this.setState({
      output2: eval(input2)
    })
    console.log(this.state.output2)
  }

  render() {
    return (
      <div>
        <button type="submit" className="button is-primary" onClick={this.run1}>
          Run
        </button>
        <p id="terminal1">
          >_
          {this.state.output1}
        </p>
        <button type="submit" className="button is-primary" onClick={this.run2}>
          Run
        </button>
        <p id="terminal2">
          >_
          {this.state.output2}
        </p>
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
