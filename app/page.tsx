import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WorkflowDemo from '@/components/WorkflowDemo';
import CareerTimeline from '@/components/CareerTimeline';
import BlogPreview from '@/components/BlogPreview';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="md:mr-[400px]">
        <Hero />
        <WorkflowDemo />
        <CareerTimeline />
        <BlogPreview />
      </main>
      <Footer />
    </>
  );
}
