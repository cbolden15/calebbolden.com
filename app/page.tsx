import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PainSolution from '@/components/PainSolution';
import Process from '@/components/Process';
import Packages from '@/components/Packages';
import Proof from '@/components/Proof';
import NowStrip from '@/components/NowStrip';
import Industries from '@/components/Industries';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="chat-offset">
        <Hero />
        <PainSolution />
        <Process />
        <Packages />
        <Proof />
        <NowStrip />
        <Industries />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
