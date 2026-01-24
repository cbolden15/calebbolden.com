import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About | Caleb Bolden',
  description: 'Product Manager and automation specialist with 10+ years optimizing operations at scale.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="md:mr-[400px] pt-32 px-6 md:px-12 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-8">
            About Me
          </h1>

          <div className="prose prose-invert prose-cyan max-w-none">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              I build intelligent systems that give people their time back. That's not just a tagline—it's
              the lens through which I evaluate every automation project, product decision, and process improvement.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Background</h2>
            <p className="text-gray-300 leading-relaxed">
              I'm currently a Product Manager at Blockdaemon, where I lead product operations for our blockchain
              infrastructure platform. Before entering the Web3 space, I spent nearly a decade in financial services
              at US Bank, Elavon, and TSYS—running operations, optimizing processes, and earning my Lean Six Sigma
              certification along the way.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Philosophy</h2>
            <p className="text-gray-300 leading-relaxed">
              Most automation conversations focus on ROI, efficiency gains, and cost reduction. Those metrics matter,
              but they miss the point. The real value of automation isn't just making businesses run better—it's
              giving people their time back to focus on work that actually requires human judgment, creativity, and empathy.
            </p>
            <p className="text-gray-300 leading-relaxed">
              When I design a workflow that eliminates 10 hours of manual lead research per week, I'm not just
              optimizing a process—I'm giving a sales team 10 hours back to have meaningful conversations with prospects.
              That's the goal: less time on repetitive tasks, more time on work that matters.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">What I Do</h2>
            <p className="text-gray-300 leading-relaxed">
              I help businesses implement intelligent automation using tools like n8n, Make.com, and modern AI APIs.
              My specialty is combining workflow orchestration with AI to create systems that don't just execute
              rules—they adapt, learn, and handle exceptions.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Common projects include lead enrichment workflows, content repurposing systems, meeting transcription
              and action item extraction, and custom automation consulting for specific business processes.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-4">Let's Work Together</h2>
            <p className="text-gray-300 leading-relaxed">
              Whether you're looking to hire a Product Operations specialist or need automation consulting for your
              business, I'd love to chat. Use the AI assistant on this site to ask questions about my background,
              or schedule a consultation directly.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
