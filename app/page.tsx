import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="md:mr-[400px]">
        <Hero />
      </main>
      <Footer />
    </>
  );
}
