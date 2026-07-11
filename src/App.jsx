import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Global Toast Alerts */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#5C4033', // Walnut brown
              color: '#FAF6F0',      // Warm cream
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(92, 64, 51, 0.2)',
              border: '1px solid rgba(183, 196, 160, 0.2)', // Sage border tint
            },
            success: {
              iconTheme: {
                primary: '#B7C4A0',   // Sage green
                secondary: '#5C4033',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FAF6F0',
              },
            },
          }}
        />

        {/* Main Routes viewport */}
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
