import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import { Provider } from 'react-redux'
import store from './redux/store'
import { initializeAuth } from './redux/initializeAuth'
import { migrateLegacyAuth } from './utils/migrateLegacyAuth'

// Migrate any existing localStorage tokens to cookies
migrateLegacyAuth();

// Initialize auth state from cookies
initializeAuth(store).then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  )
});
