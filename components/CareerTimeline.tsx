export default function CareerTimeline() {
  const experiences = [
    {
      current: true,
      period: '2023 - Present',
      title: 'Product Manager',
      company: 'Blockdaemon',
      description: 'Leading product operations for blockchain infrastructure platform. Driving automation initiatives across deployment and monitoring workflows.'
    },
    {
      current: false,
      period: '2018 - 2023',
      title: 'Sr. Operations Analyst',
      company: 'US Bank / Elavon',
      description: 'Optimized payment processing operations. Implemented Lean Six Sigma methodologies reducing processing time by 40%.'
    },
    {
      current: false,
      period: '2013 - 2018',
      title: 'Process Improvement Specialist',
      company: 'TSYS',
      description: 'Led cross-functional process improvement initiatives. Achieved $1.5M annual savings through workflow optimization.'
    }
  ];

  return (
    <section className="px-6 md:px-12 py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Career Journey
        </h2>
        <p className="text-xl text-gray-400 mb-12">
          From financial services to blockchain product management
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`p-8 rounded-xl border transition-all hover:border-primary-cyan hover:-translate-y-2 ${
                exp.current
                  ? 'bg-gradient-to-br from-primary-cyan/10 to-primary-blue/10 border-primary-cyan'
                  : 'bg-primary-cyan/5 border-primary-cyan/10'
              }`}
            >
              <div className="text-sm font-semibold text-primary-cyan mb-4">
                {exp.period}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {exp.title}
              </h3>
              <div className="text-gray-400 mb-4">
                {exp.company}
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
