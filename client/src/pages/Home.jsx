import Hero from "../sections/Hero";
import Categories from "../sections/Categories";
import Stats from "../sections/Stats";
import FeaturedVendors from "../sections/FeaturedVendors";
import WhyChooseUs from "../sections/WhyChooseUs";
import Testimonials from "../sections/Testimonials";
import CTA from "../sections/CTA";
import Footer from "../components/layout/Footer";

function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Stats />
      <FeaturedVendors />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}

export default Home;