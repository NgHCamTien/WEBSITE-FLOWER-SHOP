import React from 'react';
import Header from '../components/common/Header';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fffaf8]">
      <Header />
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;