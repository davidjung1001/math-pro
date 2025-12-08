// FILE: components/ServerHowItWorks.jsx
// This is a Server Component for static structure and SEO title.

import ClientHowItWorks from "./ClientHowItWorks"; // Import the client-side content

export default function ServerHowItWorks() {
  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Worksheet Preview
        </h2>

        {/* This div is the container for all client-side logic/previews */}
        <ClientHowItWorks />

      </div>
    </section>
  );
}