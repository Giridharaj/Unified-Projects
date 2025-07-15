import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Header from './components/Layout/Header';
import HomePage from './components/Pages/HomePage';
import StationsPage from './components/Pages/StationsPage';
import BookingsPage from './components/Pages/BookingsPage';
import ProfilePage from './components/Pages/ProfilePage';
import Toast from './components/Common/Toast';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />;
      case 'stations':
        return <StationsPage />;
      case 'bookings':
        return <BookingsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage onPageChange={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <Header currentPage={currentPage} onPageChange={setCurrentPage} />
          <main>
            {renderPage()}
          </main>
          <Toast />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;