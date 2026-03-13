import Header from '@/components/Header';
import Hero3D from '@/components/Hero3D';
import PainSolution from '@/components/PainSolution';
import Ecosystem from '@/components/Ecosystem';
import Process from '@/components/Process';
import Industries from '@/components/Industries';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="md:mr-[360px]">
        <Hero3D />
        <PainSolution />
        <Ecosystem />
        <Process />
        <Industries />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
