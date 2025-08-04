import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import styles from '../styles/refer.module.css';
import { SwiperSlide } from 'swiper/react';

export default function ReferAFriend() {
  return (
    <SwiperSlide>
      <div className={styles.referAFriend}>
        <div className={styles.iconContainer}>
          <span role="img" aria-label="gift" className={styles.giftIcon}></span>
        </div>
        <h3></h3>
        <p></p>
        
        
        
      </div>
    </SwiperSlide>
  );
}
