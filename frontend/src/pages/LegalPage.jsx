import { useState } from 'react'
import React from 'react'

// ─── Legal Content ────────────────────────────────────────────────────────────
// Edit the text in each section's `body` field to customise the content.
// To add a new section, append an object with { heading, body } to the array.
// Set `kofi: true` on any section to show a Ko-fi button below its body text.
export const LEGAL_CONTENT = {
  contact: {
    title: 'Contact Us',
    lastUpdated: 'May 2026',
    sections: [
      {
        heading: 'Get in Touch',
        body: 'KamAI is a free, open-source project built to make sign language more accessible to everyone. We would love to hear from you - whether it is a bug report, a feature idea, or just a kind word.\nYou can reach us at kamaisignlanguage@gmail.com',
      },
      {
        heading: 'Support & Donations',
        body: 'KamAI is free forever and will always remain so. If KamAI has helped you communicate, consider supporting us on Ko-fi. Every coffee keeps the project maintained.',
        kofi: true,
      },
      {
        heading: 'Response Time',
        body: 'This is a small independent project. We aim to respond within a few days, but we appreciate your patience.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'May 2026',
    sections: [
      {
        heading: 'Privacy Policy',
        body: 'By using KamAI, you agree to the terms outlined in this Privacy Policy. This document explains how we collect, use, and protect personal information related to your interaction with out website and the service provided through it.',
      },
      {
        heading: '1. Our Core Promise',
        body: 'KamAI does not collect, store, or transmit any personally identifiable information. Your camera feed never leaves your device - it is processed entirely in your browser using MediaPipe\'s on-device machine learning.',
      },
      {
        heading: '2. What We Process',
        body: 'When you use Sign to Text, individual video frames are processed locally on your device to identify hand gestures. Because the AI model runs entirely within your browser, your camera feed is never uploaded to a server, logged, or stored. Each frame is analyzed in real-time and immediately cleared from memory after the letter is identified, ensuring your data remains private and stays on your machine.',
      },
      {
        heading: '3. Data Usage',
        body: 'We do not collect names, emails, IP addresses, device identifiers, usage analytics, or any behavioural data. There are no cookies, no tracking pixels, and no third-party analytics scripts on this site.',
      },
      {
        heading: '4. Third-Party Services',
        body: 'KamAI loads hand-tracking model files from jsDelivr CDN and flag icons from flagcdn.com. Both are standard CDN services. We recommend reviewing their own privacy policies if you have concerns about CDN-level logging.',
      },
      {
        heading: '5. Child Safety',
        body: 'KamAI does not knowingly collect any data from users of any age, as we collect no data at all. The tool is safe for use by children, subject to parental discretion regarding webcam use.',
      },
      {
        heading: '6. Contact',
        body: 'Questions about privacy? See our Contact page.',
      },
    ],
  },
  terms: {
    title: 'Terms of Use',
    lastUpdated: 'May 2026',
    sections: [
      {
        heading: '1. Acceptance',
        body: 'By using KamAI, you agree to these Terms of Use. If you do not agree, please discontinue use of the service.',
      },
      {
        heading: '2. Description of Service',
        body: 'KamAI is a free, browser-based sign language recognition tool. It uses on-device AI to translate hand gestures into text in real time. The service is provided as-is, without warranty of any kind.',
      },
      {
        heading: '3. Accuracy Disclaimer',
        body: 'KamAI\'s sign language recognition is powered by a machine learning model and is not 100% accurate. It should not be used as the sole means of communication in safety-critical situations. It is intended as an assistive aid and educational resource, not a substitute for professional interpretation services.',
      },
      {
        heading: '4. Acceptable Use',
        body: 'KamAI is provided for personal and educational purposes. While you are encouraged to use the tool for learning and personal exploration, any other commercial use, redistribution, or monetization of KamAI by users is strictly prohibited. You may not use the service in a way that harms others or violates applicable law.',
      },
      {
        heading: '5. Limitation of Liability',
        body: 'KamAI is provided free of charge. To the fullest extent permitted by law, the creators of KamAI are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the service. We aim to provide a seamless experience, but we do not warrant that the service will be continuous, error-free, or entirely immune to security vulnerabilities. Use of the service is at your own risk.',
      },
	  {
        heading: '6. Change of Terms',
        body: 'We reserve the right to modify these terms at any time. Updates are effective immediately upon posting to the website, and your continued use of the service signifies your agreement to the revised terms.',
      },
    ],
  },
}

// ─── Legal Page ───────────────────────────────────────────────────────────────
export function LegalPage({ page, navigate }) {
  const content = LEGAL_CONTENT[page]
  if (!content) return null
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <button onClick={() => navigate('/')}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)' }} className="font-bold text-gray-900">
              Kam<span className="text-teal-500">AI</span>
            </span>
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="mb-10">
          <h1 style={{ fontFamily: 'var(--font-display)' }}
            className="font-black text-3xl sm:text-4xl text-gray-900 mb-2">{content.title}</h1>
          <p className="text-sm text-gray-400">Last updated: {content.lastUpdated}</p>
        </div>

        <div className="space-y-5">
          {content.sections.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-sm">
              <h2 style={{ fontFamily: 'var(--font-display)' }}
                className="font-bold text-lg text-gray-900 mb-3">{s.heading}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
              {s.kofi && (
                <a href="https://ko-fi.com/E1E21X5T2F" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 bg-teal-500 hover:bg-teal-600
                    text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
                  </svg>
                  Support on Ko-fi
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200 flex flex-wrap items-center gap-4">
          {[
            { key: 'contact', path: '/contact',        label: 'Contact' },
            { key: 'privacy', path: '/privacy-policy', label: 'Privacy Policy' },
            { key: 'terms',   path: '/terms',          label: 'Terms of Use' },
          ].filter(l => l.key !== page).map(l => (
            <button key={l.key} onClick={() => navigate(l.path)}
              className="text-sm text-gray-500 hover:text-teal-500 underline underline-offset-2 transition-colors">
              {l.label}
            </button>
          ))}
          <button onClick={() => navigate('/')}
            className="ml-auto text-sm font-semibold text-teal-500 hover:text-teal-600
              flex items-center gap-1.5 transition-colors">
            Back to KamAI
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        </div>
      </main>
    </div>
  )
}
