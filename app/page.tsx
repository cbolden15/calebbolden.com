import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WorkflowDemo from '@/components/WorkflowDemo';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="md:mr-[400px]">
        <Hero />
        <WorkflowDemo />
      </main>
      <Footer />
    </>
  );
}
