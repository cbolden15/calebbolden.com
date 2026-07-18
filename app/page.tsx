import Header from '@/components/Header';
import HeroInstrument from '@/components/HeroInstrument';
import PainSolution from '@/components/PainSolution';
import Process from '@/components/Process';
import AISystems from '@/components/AISystems';
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
        <HeroInstrument />
        <PainSolution />
        <Process />
        <AISystems />
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
