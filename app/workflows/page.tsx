import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Workflows | Caleb Bolden',
  description: 'Real-world automation workflows that eliminate manual work and drive results.',
};

export default function WorkflowsPage() {
  const workflows = [
    {
      slug: 'lead-enrichment',
      title: 'Lead Enrichment',
      description: 'Automatically research and score new leads with AI',
      category: 'Sales',
      impact: '10 hours saved per week',
    },
    {
      slug: 'content-repurposing',
      title: 'Content Repurposing',
      description: 'Turn blog posts into multi-platform content',
      category: 'Marketing',
      impact: '80% faster content distribution',
    },
    {
      slug: 'meeting-notes',
      title: 'Meeting Notes Automation',
      description: 'Record, transcribe, and extract action items',
      category: 'Operations',
      impact: '5 hours saved per week',
    },
  ];

  return (
    <>
      <Header />
      <main className="md:mr-[400px] pt-32 px-6 md:px-12 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
            Workflow Portfolio
          </h1>
          <p className="text-xl text-gray-400 mb-16">
            Real-world automation workflows that eliminate manual work
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workflows.map((workflow) => (
              <div
                key={workflow.slug}
                className="p-8 bg-primary-cyan/5 border border-primary-cyan/10 rounded-xl hover:border-primary-cyan hover:-translate-y-2 transition-all"
              >
                <span className="inline-block px-3 py-1 bg-primary-cyan/10 border border-primary-cyan/30 rounded-full text-xs text-primary-cyan mb-4">
                  {workflow.category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {workflow.title}
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {workflow.description}
                </p>
                <div className="text-sm font-semibold text-primary-cyan">
                  {workflow.impact}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-primary-cyan/5 border border-primary-cyan/10 rounded-xl text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Need a Custom Workflow?
            </h2>
            <p className="text-gray-400 mb-6">
              These are just examples. Every business has unique processes that can be automated.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-primary-cyan to-primary-blue text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-cyan/30 hover:-translate-y-0.5 transition-all">
              Schedule a Consultation
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
