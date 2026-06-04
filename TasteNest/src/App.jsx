import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PromoCards from './components/PromoCards';
import BannerPizza from './components/BannerPizza';
import Categories from './components/Categories';
import DeliveryChallenge from './components/DeliveryChallenge';
import MenuGrid from './components/MenuGrid';
import TrendingMenu from './components/TrendingMenu';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import ServiceSteps from './components/ServiceSteps';
import Blog from './components/Blog';
import InstagramGrid from './components/InstagramGrid';
import Footer from './components/Footer';

function App() {
  return (
    <div className="font-oswald bg-[#fcfbfa] text-neutral-900 antialiased selection:bg-red-500 selection:text-white">
      <Navbar />
      <Hero />
      <PromoCards />
      <BannerPizza />
      <Categories />
      <DeliveryChallenge />
      <MenuGrid />
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
