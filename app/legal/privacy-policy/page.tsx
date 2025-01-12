import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-gray-700">
            We collect minimal information necessary to provide our PDF modification services:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Temporarily stored PDF files during processing</li>
            <li>Basic usage analytics</li>
            <li>Technical information (browser type, operating system)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-gray-700">
            Your information is used solely for:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Providing PDF modification services</li>
            <li>Improving our service quality</li>
            <li>Technical troubleshooting</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. File Storage and Security</h2>
          <p className="text-gray-700">
            All uploaded files are:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Processed securely</li>
            <li>Automatically deleted after processing</li>
            <li>Never shared with third parties</li>
            <li>Stored temporarily in secure servers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Third-Party Services</h2>
          <p className="text-gray-700">
            We use Adobe&apos;s PDF Services API for certain operations. Their use of your data is governed by their own privacy policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Cookies</h2>
          <p className="text-gray-700">
            We use essential cookies to ensure the proper functioning of our service. For more details, please refer to our Cookie Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
          <p className="text-gray-700">
            You have the right to:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Access your personal data</li>
            <li>Request data deletion</li>
            <li>Object to data processing</li>
            <li>Request data portability</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Contact Information</h2>
          <p className="text-gray-700">
            For any privacy-related concerns, please contact us through our website.
          </p>
        </section>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
} 