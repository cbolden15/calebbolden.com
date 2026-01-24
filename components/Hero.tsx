export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 py-24 relative">
      {/* Background gradient orbs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary-cyan rounded-full blur-[100px] opacity-15 pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-primary-blue rounded-full blur-[100px] opacity-15 pointer-events-none -z-10" />

      {/* Content */}
      <div className="max-w-4xl">
        {/* Tagline chips */}
        <div className="flex flex-wrap gap-4 mb-8">
          <span className="px-4 py-2 bg-primary-cyan/10 border border-primary-cyan/30 rounded-full text-sm text-primary-cyan">
            Product Operations
          </span>
          <span className="px-4 py-2 bg-primary-cyan/10 border border-primary-cyan/30 rounded-full text-sm text-primary-cyan">
            AI Automation
          </span>
          <span className="px-4 py-2 bg-primary-cyan/10 border border-primary-cyan/30 rounded-full text-sm text-primary-cyan">
            Process Improvement
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span className="gradient-text">
            I build intelligent systems that give people their time back.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl">
          Product Manager at Blockdaemon with 10+ years optimizing operations at scale.
          Lean Six Sigma certified. Building the future of automated workflows.
        </p>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl p-8 bg-primary-cyan/5 border border-primary-cyan/10 rounded-xl">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-cyan mb-2">10+</div>
            <div className="text-sm text-gray-400">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-cyan mb-2">50+</div>
            <div className="text-sm text-gray-400">Workflows Built</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary-cyan mb-2">$2M+</div>
            <div className="text-sm text-gray-400">Process Savings</div>
          </div>
        </div>
      </div>
    </section>
  );
}
