import React from 'react'
import { render } from 'react-dom'

//import reportWebVitals from './reportWebVitals';
import App from './app/App'

// Render the main component of our electron application into the 'root' div
render(<App />, document.getElementById('root'))
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();