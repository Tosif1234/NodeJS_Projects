import Navbar from './components/Navbar';
import PromoCards from './components/PromoCards';
import BannerPizza from './components/BannerPizza';
import MenuGrid from './components/MenuGrid';
import TrendingMenu from './components/TrendingMenu';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import ServiceSteps from './components/ServiceSteps';
import Blog from './components/Blog';
import InstagramGrid from './components/InstagramGrid';
import Footer from './components/Footer';
import AboutFood from './components/AboutFood';
import PromoGrid from './components/PromoGrid';
import HeroAndDelivery from './components/HeroAndDelivery';

function App() {
  return (
    <div className="font-oswald bg-[#fcfbfa] text-neutral-900 antialiased selection:bg-red-500 selection:text-white overflow-x-hidden">
      <Navbar />
      <BannerPizza />
      <PromoCards />
      <AboutFood/>
      <MenuGrid />
      <HeroAndDelivery/>
      <PromoGrid/>
      <TrendingMenu />
      <AboutUs />
      <Services />
      <ServiceSteps />
      <Blog />
      <InstagramGrid />
      <Footer />
    </div>
  );
}

export default App;
