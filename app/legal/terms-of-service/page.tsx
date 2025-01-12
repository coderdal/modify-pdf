import React from 'react';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-700">
            By accessing and using this PDF modification service, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
          <p className="text-gray-700">
            We provide various PDF modification services including but not limited to compression, protection, merging, splitting, and OCR capabilities. Some features utilize Adobe&apos;s API services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. User Obligations</h2>
          <p className="text-gray-700">
            Users agree to:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Use the service for lawful purposes only</li>
            <li>Not upload malicious files or content</li>
            <li>Not attempt to circumvent any service limitations</li>
            <li>Not use automated tools or scripts to access the service</li>
            <li>Respect intellectual property rights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Privacy and Data</h2>
          <p className="text-gray-700">
            We process files temporarily and do not store them permanently. All uploaded files are automatically deleted after processing. For more information, please refer to our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Service Limitations</h2>
          <p className="text-gray-700">
            As a free service, we implement the following limitations:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Rate limiting on API requests per IP address</li>
            <li>Maximum file size restrictions</li>
            <li>Processing time limitations</li>
            <li>Concurrent operation limits</li>
          </ul>
          <p className="text-gray-700 mt-2">
            These limitations are in place to ensure fair usage and service availability for all users. We reserve the right to modify these limitations at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Disclaimer</h2>
          <p className="text-gray-700">
            The service is provided &quot;as is&quot; without warranty of any kind. We do not guarantee that the service will be uninterrupted or error-free.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Changes to Terms</h2>
          <p className="text-gray-700">
            We reserve the right to modify these terms at any time. Continued use of the service after such modifications constitutes acceptance of the new terms.
          </p>
        </section>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
} 