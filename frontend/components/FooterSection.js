import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import styles from '../styles/footer.module.css';

export default function FooterSection() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Company Info & Support Section */}
        <div className={styles.companySection}>
          <h3 className={styles.brandName}>The Plan Cave</h3>
          <p className={styles.companyDesc}>
            Your go-to platform for architectural designs tailored to meet your needs and budget.
          </p>
          <div className={styles.supportInfo}>
            <h4 className={styles.sectionTitle}>Need help?</h4>
            <a href="mailto:support@theplancave.com" className={styles.emailLink}>
              support@theplancave.com
            </a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Quick Links</h4>
          <ul className={styles.linksList}>
            <li><a href="/services" className={styles.link}>Our Services</a></li>
            <li><a href="/projects" className={styles.link}>Recent Projects</a></li>
            <li><a href="/about" className={styles.link}>About Us</a></li>
            <li><a href="/contact" className={styles.link}>Contact</a></li>
          </ul>
        </div>

        {/* Connect Section */}
        <div className={styles.connectSection}>
          <h4 className={styles.sectionTitle}>Connect With Us</h4>
          <div className={styles.socialIcons}>
            <a href="https://web.facebook.com/profile.php?id=100083155669669" target="_blank" rel="noopener noreferrer" className={styles.icon}>
              <FaFacebookF />
            </a>
            <a href="https://x.com/theplancave" target="_blank" rel="noopener noreferrer" className={styles.icon}>
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com/theplancavespaces/" target="_blank" rel="noopener noreferrer" className={styles.icon}>
              <FaInstagram />
            </a>
            <a href="https://wa.me/+254723029566" target="_blank" rel="noopener noreferrer" className={styles.icon}>
              <FaWhatsapp />
            </a>
          </div>
          <div className={styles.newsletter}>
            <h4 className={styles.sectionTitle}>Stay Updated</h4>
            <div className={styles.subscribeForm}>
              <input type="email" placeholder="Your email" className={styles.emailInput} />
              <button className={styles.subscribeBtn}>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p className={styles.copyright}>
          © {currentYear} The Plan Cave. All rights reserved.
        </p>
        <div className={styles.legalLinks}>
          <a href="/privacy" className={styles.legalLink}>Privacy Policy</a>
          <a href="/terms" className={styles.legalLink}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}