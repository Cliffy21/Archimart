import React from 'react';
import { SessionProvider } from "next-auth/react";
import '../styles/globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/Navbar.css';
import '../styles/GridSection.css';
import '../styles/FamilySize.css';
import '../styles/BudgetPlans.css';
import '../styles/TopSellingPlans.css';
import '../styles/BlogSection.css';
import '../styles/ContactUs.css';
import '../styles/ProductCard.module.css';
import { AppProvider } from '../context/AppContext';
import { CartProvider } from '../context/CartContext';


function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AppProvider>
        <CartProvider>
          <Component {...pageProps} /> 
        </CartProvider>
      </AppProvider>
    </SessionProvider>
  );
}

export default MyApp;
