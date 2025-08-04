import dynamic from 'next/dynamic';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import ReferAFriend from './refer';

// Dynamically load Swiper and SwiperSlide
const SwiperComponent = dynamic(
  () => import('swiper/react').then((mod) => mod.Swiper),
  { ssr: false }
);

export default function MySlider({ children }) {
  return (
    <SwiperComponent
      modules={[Navigation, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      autoplay={{ delay: 5000 }}
      navigation

      
    >

      <ReferAFriend/>
      {children}
    </SwiperComponent>
  );
}
