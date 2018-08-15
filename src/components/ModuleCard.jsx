// import React, {Component} from 'react'
// import {DragSource} from 'react-dnd'
// import Messaging from './Messaging'

// import PropTypes from 'prop-types'
// import {withStyles} from '@material-ui/core/styles'
// import Card from '@material-ui/core/Card'
// import CardContent from '@material-ui/core/CardContent'
// import Button from '@material-ui/core/Button'
// import Typography from '@material-ui/core/Typography'

// class ModuleCard extends Component {
//   render() {
//     const {classes, connectDragSource, isDragging} = this.props
//     return connectDragSource(
//       <div>
//             <Messaging
//               chatsId={this.props.chatsId}
//               roomId={this.props.roomId}
//             />

//       </div>
//     )
//   }
// }

// ModuleCard.propTypes = {
//   classes: PropTypes.object.isRequired,
//   connectDragSource: PropTypes.func.isRequired,
//   isDragging: PropTypes.bool.isRequired
// }

// export default DragSource('MODULE', messagingSource, collect)(
//   withStyles(styles)(ModuleCard)
// )
