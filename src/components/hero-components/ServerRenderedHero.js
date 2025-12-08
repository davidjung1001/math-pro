// ServerRenderedHero.jsx
import Header from "../Header";
import ClientHeroExtras from "./ClientHeroExtras";

export default function ServerRenderedHero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header />

      <div className="flex flex-col items-center text-center text-gray-900 overflow-hidden 
                      pt-16 pb-16 md:pt-8 md:pb-20 px-6">
        <div className="relative max-w-4xl mx-auto w-full z-20">

          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6 font-semibold text-sm shadow-sm">
            100% Free Math Resources
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900">
            Free Worksheets <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Download & Print
            </span>
          </h1>

          <p className="text-lg sm:text-xl mb-4 max-w-2xl mx-auto text-gray-700 leading-relaxed font-medium">
            Everything you need to teach
          </p>
          <p className="text-base sm:text-lg mb-14 max-w-2xl mx-auto text-gray-600 leading-relaxed">
            Digital learning modules, printable worksheets, and personalized diagnostics — all completely free, designed to help students truly understand math concepts.
          </p>

          {/* Client Cards */}
          <div className="w-full">
            <ClientHeroExtras />
          </div>

          <div className="text-gray-600 mt-6">
            <p className="text-sm mb-2 font-semibold">Built by Math Experts</p>
            <p className="text-xs text-gray-500">Designed to help students truly understand — not just memorize</p>
          </div>

        </div>
      </div>
    </section>
  );
}
