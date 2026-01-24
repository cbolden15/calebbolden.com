import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Contact | Caleb Bolden',
  description: 'Get in touch to discuss automation projects or job opportunities.',
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="md:mr-[400px] pt-32 px-6 md:px-12 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-8">
            Get in Touch
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Employers */}
            <div className="p-8 bg-primary-cyan/5 border border-primary-cyan/10 rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-4">
                For Employers
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Looking to hire a Product Operations specialist with automation expertise?
                Let's discuss how I can help your team.
              </p>
              <div className="space-y-4">
                <a
                  href="https://linkedin.com/in/calebbolden"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-3 border-2 border-primary-cyan text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-all text-center font-semibold"
                >
                  View LinkedIn Profile
                </a>
                <button className="w-full px-6 py-3 border-2 border-primary-cyan text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-all font-semibold">
                  Schedule Interview
                </button>
              </div>
            </div>

            {/* For Automation Clients */}
            <div className="p-8 bg-gradient-to-br from-primary-cyan/10 to-primary-blue/10 border border-primary-cyan rounded-xl">
              <h2 className="text-2xl font-bold text-white mb-4">
                For Automation Clients
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Need intelligent workflows that save time and scale your operations?
                Let's explore what's possible.
              </p>
              <div className="space-y-4">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-primary-cyan to-primary-blue text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary-cyan/30 hover:-translate-y-0.5 transition-all">
                  Book Free Consultation
                </button>
                <a
                  href="mailto:cbolden15@gmail.com"
                  className="block px-6 py-3 border-2 border-primary-cyan text-primary-cyan rounded-lg hover:bg-primary-cyan/10 transition-all text-center font-semibold"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>

          {/* Or Use the AI Chat */}
          <div className="mt-12 p-8 bg-primary-cyan/5 border border-primary-cyan/10 rounded-xl text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Not sure what to ask?
            </h2>
            <p className="text-gray-400">
              Use the AI assistant on this site to ask questions about my background,
              services, or availability. It knows everything and can point you in the right direction.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
