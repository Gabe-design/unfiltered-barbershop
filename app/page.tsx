import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import TrustBar from "@/components/home/trust-bar";
import AboutSection from "@/components/home/about-section";
import ServicesSection from "@/components/home/services-section";
import WhyChooseSection from "@/components/home/why-choose-section";
import TeamSection from "@/components/home/team-section";
import { GalleryPreview } from "@/components/home/gallery-preview";
import TestimonialsSection from "@/components/home/testimonials-section";
import FaqSection from "@/components/home/faq-section";
import { ContactMapSection } from "@/components/home/contact-map-section";
import CtaSection from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <AboutSection />
        <ServicesSection />
        <WhyChooseSection />
        <TeamSection />
        <GalleryPreview />
        <TestimonialsSection />
        <FaqSection />
        <ContactMapSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
