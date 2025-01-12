import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. What Are Cookies</h2>
          <p className="text-gray-700">
            Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience and are essential for certain features of our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Cookies</h2>
          <p className="text-gray-700">
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Essential cookies for service functionality</li>
            <li>Session management</li>
            <li>Performance monitoring</li>
            <li>User preference storage</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Types of Cookies We Use</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-xl text-gray-800">Essential Cookies</h3>
              <p className="text-gray-700">Required for basic service functionality and cannot be disabled.</p>
            </div>
            <div>
              <h3 className="font-semibold text-xl text-gray-800">Performance Cookies</h3>
              <p className="text-gray-700">Help us understand how visitors interact with our website.</p>
            </div>
            <div>
              <h3 className="font-semibold text-xl text-gray-800">Functional Cookies</h3>
              <p className="text-gray-700">Remember your preferences and settings.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Managing Cookies</h2>
          <p className="text-gray-700">
            Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may affect the functionality of our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Third-Party Cookies</h2>
          <p className="text-gray-700">
            We may use third-party services that also set cookies. These services include:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Analytics services</li>
            <li>PDF processing services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Updates to This Policy</h2>
          <p className="text-gray-700">
            We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
          </p>
        </section>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
} 