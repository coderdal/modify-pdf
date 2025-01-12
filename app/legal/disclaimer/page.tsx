import React from 'react';

export default function Disclaimer() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Service Accuracy</h2>
          <p className="text-gray-700">
            While we strive to provide accurate and reliable PDF modification services, we make no representations or warranties about the accuracy, reliability, completeness, or timeliness of any information provided through our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Use at Your Own Risk</h2>
          <p className="text-gray-700">
            The use of our PDF modification service is at your own risk. We are not responsible for any damages or losses resulting from:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Service interruptions or downtime</li>
            <li>File corruption or loss</li>
            <li>Errors in PDF processing</li>
            <li>Security breaches beyond our control</li>
            <li>Rate limiting or service restrictions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Third-Party Services</h2>
          <p className="text-gray-700">
            Our service utilizes Adobe&apos;s PDF Services API and other third-party services. We are not responsible for any issues arising from these third-party services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Intellectual Property</h2>
          <p className="text-gray-700">
            Users are responsible for ensuring they have the necessary rights to modify and process the PDF files they upload. We do not claim ownership of your content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Service Modifications</h2>
          <p className="text-gray-700">
            As a free service, we implement certain limitations to ensure fair usage. We reserve the right to:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Modify or discontinue any part of our service</li>
            <li>Adjust rate limits and usage restrictions</li>
            <li>Change service features and limitations</li>
            <li>Block access in cases of abuse</li>
            <li>Modify this disclaimer at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Limitation of Liability</h2>
          <p className="text-gray-700">
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Contact</h2>
          <p className="text-gray-700">
            If you have any questions about this disclaimer, please contact us through our website.
          </p>
        </section>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
} 