// // Import from the module './whiteboard':
// //   The default export, naming it draw,
// //   An export named `events`, calling it `whiteboard`.
// import whiteboard, {draw} from './whiteboard'
// import firebase from 'firebase'
// import db from '../../fire'
// // import axios from 'axios'
// // import { builtinModules } from 'module';

// // Example: Draw a single stroke.
// draw([0, 0], [250, 250], 'red', true)

// whiteboard.on('draw', (start, end, strokeColor) => {
//   return db
//     .ref('/whiteboards')
//     .push({
//       start,
//       end,
//       strokeColor
//     })
//     .catch(error => {
//       console.error('Error drawing new stroke to Firebase database:', error)
//     })
// })

// // let socket = io(window.location.origin);

// // whiteboard.on('draw', function(start,end,strokeColor){

// //   socket.emit('drawingToServer', {
// //     start: start,
// //     end : end,
// //     strokeColor : strokeColor
// //   });

// // })

// // socket.on('drawFromDb', (drawings) => {
// //   drawings.forEach((drawing) => {
// //     draw(drawing.start, drawing.end, drawing. strokeColor);
// //   })
// // })

// // socket.on('connect', function() {
// //   console.log('I have made a persistent two-way connection to the server!')
// // })

// // socket.on('drawingToClients', (drawing) => {
// //   draw(drawing.start, drawing.end, drawing.strokeColor);
// // })

// // socket.on('receive', (obj) => {
// //   console.log(obj.message + ' successful');
// // })
