import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://source.unsplash.com/featured/?children,hope" 
          alt="Children at MAMA FATIMA Home" 
          fill 
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-black/40 z-10"></div>
      </div>
      <div className="container mx-auto relative z-20 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Give Hope to Children in Need
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          Your donation to MAMA FATIMA Children's Home provides shelter, education, and love to vulnerable children.
        </p>
        <Button asChild size="lg" className="mr-4">
          <Link href="/donate">Donate Now</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/about">Learn More</Link>
        </Button>
      </div>
    </section>
  );
};

export default HeroSection; 