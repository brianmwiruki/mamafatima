import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CtaSection = () => {
  return (
    <section className="py-16 text-center">
      <h2 className="text-3xl font-bold mb-4">Join Us in Making a Difference</h2>
      <p className="mb-6">Your support can change lives. Get involved today!</p>
      <Button asChild size="lg">
        <Link href="/donate">Donate Now</Link>
      </Button>
    </section>
  );
};

export default CtaSection;
