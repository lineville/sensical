import firebase from 'firebase'
require('firebase/firestore')

var config = {
  apiKey: 'AIzaSyA0BTlfc4ebyjzr9eqYdCm2PG6Vmw3D5mU',
  authDomain: 'fig-neutron.firebaseapp.com',
  databaseURL: 'https://fig-neutron.firebaseio.com',
  projectId: 'fig-neutron',
  storageBucket: 'fig-neutron.appspot.com',
  messagingSenderId: '703032848802'
}

firebase.initializeApp(config)
let db = firebase.firestore()

const settings = {timestampsInSnapshots: true}
db.settings(settings)

export default db
