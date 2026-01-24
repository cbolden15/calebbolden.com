import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-32 px-6 min-h-screen">
        <h1 className="text-4xl">Layout Test</h1>
      </main>
      <Footer />
    </>
  );
}
