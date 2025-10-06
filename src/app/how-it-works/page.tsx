import React from 'react';
import Navbar from '@/src/components/navbar';

const steps = [
  {
    title: '1. Browse & Discover',
    body: 'Clients explore approved properties with rich details (price, location, amenities, images). Map/location support helps shortlist suitable listings.'
  },
  {
    title: '2. Schedule a Viewing',
    body: 'Clients request a viewing. An assistant (staff) can be assigned to coordinate timing and logistics before a lease draft is created.'
  },
  {
    title: '3. Lease Draft Creation (Simplified Flow)',
    body: 'Assistant prepares a lease draft with key financial, date and utility terms. This draft starts in draft status.'
  },
  {
    title: '4. Client Decision',
    body: 'Client reviews the draft and either Accepts (moves to client_accepted) or Rejects (moves to client_rejected). A rejection simply notifies the assistant to adjust terms—there is no separate negotiation thread.'
  },
  {
    title: '5. Assistant Revision or Cancellation',
    body: 'If rejected, the assistant can update terms (returning the draft to draft) or cancel the process (canceled status).' 
  },
  {
    title: '6. Manager Approval & Finalization',
    body: 'Once the client has accepted, a manager approves the draft. Approval auto-creates the final Lease record and the draft advances to signed (final state).'
  },
  {
    title: '7. Property Status Update',
    body: 'When a lease is finalized the property can transition to rented to avoid further leasing actions.'
  }
];

const roles = [
  {
    role: 'Client',
    actions: ['Browse properties', 'Request viewings', 'Accept or reject lease drafts', 'View finalized leases']
  },
  {
    role: 'Assistant',
    actions: ['Create / update lease drafts', 'Cancel drafts when needed', 'Coordinate viewings']
  },
  {
    role: 'Manager',
    actions: ['Approve accepted drafts', 'Oversee property portfolio']
  },
  {
    role: 'Owner',
    actions: ['(Future) Monitor performance, view lease occupancy metrics']
  },
  {
    role: 'Supervisor',
    actions: ['(Future) Elevated oversight & reporting']
  }
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-4">How Dream<span className="text-primary">Home</span> Works</h1>
        <p className="text-gray-600 max-w-2xl mb-12 leading-relaxed">
          A streamlined property leasing workflow focused on clarity. We replaced multi-step negotiations with a clean, linear draft → client decision → manager approval pipeline.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mb-20">
          {steps.map(step => (
            <div key={step.title} className="p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mb-6">Platform Roles</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {roles.map(r => (
            <div key={r.role} className="border bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-medium mb-3 text-primary">{r.role}</h3>
              <ul className="space-y-1 text-sm text-gray-600 list-disc pl-4">
                {r.actions.map(a => <li key={a}>{a}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mb-4">Simplified Lease Lifecycle</h2>
        <ol className="list-decimal pl-6 text-sm text-gray-700 space-y-1 mb-12">
          <li>draft → created by assistant</li>
          <li>client_accepted or client_rejected → based on client decision</li>
          <li>assistant_update returns to draft if client rejected</li>
          <li>manager_approve after client_accepted → approved + auto final lease (signed)</li>
          <li>canceled (terminal) if assistant terminates before approval</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
        <div className="grid md:grid-cols-4 gap-4 mb-16 text-sm">
          <div className="p-4 rounded-lg border bg-white">Next.js (App Router)</div>
          <div className="p-4 rounded-lg border bg-white">TypeScript</div>
          <div className="p-4 rounded-lg border bg-white">Prisma ORM</div>
          <div className="p-4 rounded-lg border bg-white">PostgreSQL (Neon)</div>
          <div className="p-4 rounded-lg border bg-white">Role-based Auth (JWT)</div>
          <div className="p-4 rounded-lg border bg-white">Tailwind / Utility CSS</div>
          <div className="p-4 rounded-lg border bg-white">API Route Handlers</div>
          <div className="p-4 rounded-lg border bg-white">Container-ready Deployment</div>
        </div>

        <div className="bg-white border rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Why This Flow?</h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Traditional negotiation chains introduce complexity, persistence overhead, and unclear responsibility boundaries. This streamlined model eliminates message threading and focuses each role on a single, unambiguous next action.
          </p>
          <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1 mb-6">
            <li>Lower cognitive load for clients</li>
            <li>Faster assistant iteration on terms</li>
            <li>Clear approval authority for managers</li>
            <li>Predictable database state transitions</li>
          </ul>
          <p className="text-sm text-gray-600">
            Future enhancements can reintroduce structured feedback (e.g. reason codes) without reinstating full negotiation chains.
          </p>
        </div>
      </section>
    </main>
  );
}
