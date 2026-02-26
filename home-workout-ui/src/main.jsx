import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css'

// Nastavení Axios pro cookies (nutné pro autentizaci) - musí být před importem App
axios.defaults.withCredentials = true;

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
