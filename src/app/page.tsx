import HeroSection from '@/components/home/hero-section';
import ImpactStats from '@/components/home/impact-stats';
import Testimonials from '@/components/home/testimonials';
import CtaSection from '@/components/home/cta-section';
import DonationForm from '@/components/Donate/donation-form';

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <HeroSection />
      <ImpactStats />
      <Testimonials />
      <DonationForm />
      <CtaSection />
    </div>
  );
}
