import firebase from 'firebase'
require('firebase/firestore')

var config = {
  apiKey: 'AIzaSyBrIkO1pI5u37nnvw-43OozOZYZ4q0WZwg',
  authDomain: 'project-sensical.firebaseapp.com',
  databaseURL: 'https://project-sensical.firebaseio.com',
  projectId: 'project-sensical',
  storageBucket: 'project-sensical.appspot.com',
  messagingSenderId: '24724251792'
}

firebase.initializeApp(config)
let db = firebase.firestore()

const settings = {timestampsInSnapshots: true}
db.settings(settings)

export default db
