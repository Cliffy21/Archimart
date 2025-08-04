// pages/all-products.js
import React from "react";
import styles from '../styles/AllProducts.module.css';

export default function AllProductsPage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Your dream home awaits</h1>
          <p>Discover expertly crafted plans for every style and need.</p>
        </div>
      </section>
    </div>
  );
}
