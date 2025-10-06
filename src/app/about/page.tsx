'use client';

import Footer from '@/src/components/footer';
import Navbar from '@/src/components/navbar';
import Image from 'next/image';

export default function About() {
  return (
    <div className="bg-gray-100 text-gray-800">
      {/* Navbar */}
      <Navbar/>

      {/* Hero Section */}
      <div className="pt-12 relative h-72 flex items-center justify-center text-white text-center bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 opacity-50"
        />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">About DreamHome</h1>
          <p className="text-lg mt-2">Discover the story behind our property rental platform and meet the team that made it possible.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* About Section */}
        <section className="bg-white rounded-lg p-6 shadow-md mb-8">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2 inline-block">Our Project</h2>
          <p className="text-gray-700 mt-4">DreamHome is a comprehensive property rental management system designed to streamline the process of connecting property owners with potential renters...</p>
        </section>

        {/* Team Section */}
        <section className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2 inline-block">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {[
              { name: 'Aditya Sahrawat', reg: '23bcs006' },
              { name: 'Aditya Sharma', reg: '23bcs007' },
              { name: 'Aryan Talikoti', reg: '23bcs018' },
              { name: 'Athul Noble', reg: '23bcs020' },
              { name: 'Atithi Jaiman', reg: '23bcs021' },
              { name: 'Dhanraj Matke', reg: '23bcs042' },
              { name: 'Jayesh Patil', reg: '23bcs057' }
            ].map((member) => (
              <div key={member.reg} className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">Registration number: {member.reg}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
