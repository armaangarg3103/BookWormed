import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const About = () => {
  const features = [
    {
      icon: "📚",
      title: "Vast Book Collection",
      description: "Browse through thousands of engineering and technical books, from classic textbooks to modern references.",
      link: "/books"
    },
    {
      icon: "⭐",
      title: "Rate & Review",
      description: "Share your thoughts and help others discover great books through ratings and detailed reviews.",
      link: "/books"
    },
    {
      icon: "📝",
      title: "Personal Lists",
      description: "Organize your reading with custom lists like Want to Read, Currently Reading, and Favorites.",
      link: "/my-lists"
    },
    {
      icon: "💬",
      title: "Community Posts",
      description: "Engage with fellow readers through community discussions, book recommendations, and study tips.",
      link: "/posts"
    },
    {
      icon: "🔍",
      title: "Smart Search",
      description: "Find exactly what you're looking for with powerful search and filtering options.",
      link: "/search"
    },
    {
      icon: "📊",
      title: "Track Progress",
      description: "Monitor your reading journey with progress tracking and reading statistics.",
      link: "/my-lists"
    }
  ];

  const owners = [
    {
      name: "Kriti Gupta",
      role: "",
      github: "Kritiiguptaa",
      description: "Passionate about creating intuitive user experiences and building communities around shared interests in learning and technology.",
      expertise: ["Full Stack Development", "UI/UX Design", "Community Building"],
      avatar: "https://ui-avatars.com/api/?name=Kriti+Gupta&size=200&background=3b82f6&color=fff&bold=true"
    },
    {
      name: "Armaan GarG",
      role: "",
      github: "armaangarg3103",
      description: "Dedicated to building robust and scalable systems that empower students and professionals in their learning journey of Engineering.",
      expertise: ["Backend Development", "Database Design", "System Architecture"],
      avatar: "https://ui-avatars.com/api/?name=Armaan+Garg&size=200&background=10b981&color=fff&bold=true"
    },
    {
      name: "Suyash Gupta",
      role: "",
      github: "SuyashN07",
      description: "Focused on creating seamless user experiences and implementing innovative features that enhance the learning ecosystem.",
      expertise: ["Frontend Development", "React", "Performance Optimization"],
      avatar: "https://ui-avatars.com/api/?name=Suyash+Gupta&size=200&background=f59e0b&color=fff&bold=true"
    },
    {
      name: "Isha Gupta",
      role: "",
      github: "ishagupta01",
      description: "Dedicated to quality assurance and ensuring a smooth, bug-free experience for all users across the platform.",
      expertise: ["Quality Assurance", "Testing", "Documentation"],
      avatar: "https://ui-avatars.com/api/?name=Isha+Gupta&size=200&background=ec4899&color=fff&bold=true"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-gray-900 to-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
         <span className="text-emerald-400">BookWormd</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your ultimate platform for discovering, organizing, and discussing engineering and technical books. 
            Join our community of passionate learners and book enthusiasts.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Our Mission</h2>
          <p className="text-gray-300 text-lg text-center max-w-4xl mx-auto leading-relaxed">
            We believe that access to quality educational resources should be easy and organized. 
            BookWorm was created to help students, professionals, and lifelong learners discover the best 
            technical books, share their experiences, and build a supportive community around continuous learning. 
            Whether you're preparing for exams, expanding your skills, or exploring new technologies, 
            we're here to make your learning journey more efficient and enjoyable.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-all hover:transform hover:scale-105 cursor-pointer group"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-gradient-to-r from-blue-900 to-emerald-900 rounded-lg p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-gray-300">Books in Library</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-300">Active Readers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">{useContext(AppContext)?.siteStats?.reviews ?? '0'}+</div>
              <div className="text-gray-300">Reviews & Ratings</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start Your Reading Journey Today</h2>
          <p className="text-gray-300 text-lg mb-6">
            Join our community and discover your next favorite book
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/books"
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Browse Books
            </Link>
            <Link
              to="/posts"
              className="px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
            >
              Join Community
            </Link>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-3 text-center">Meet the Team</h2>
          <p className="text-gray-400 text-center mb-10">
            The passionate individuals behind BookWorm
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {owners.map((owner, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-all hover:transform hover:scale-105"
              >
                {/* Card Header with Avatar */}
                <div className="bg-gradient-to-br from-blue-900 to-gray-800 p-8 text-center">
                  <img
                    src={owner.avatar}
                    alt={owner.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                  />
                  <h3 className="text-2xl font-bold text-white mb-1">{owner.name}</h3>
                  <p className="text-blue-300 font-semibold mb-3">{owner.role}</p>
                  <a
                    href={`https://github.com/${owner.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    @{owner.github}
                  </a>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-gray-300 mb-4 leading-relaxed">{owner.description}</p>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Areas of Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {owner.expertise.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-900 text-blue-300 text-xs px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-lg mb-4">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <a
            href="https://github.com/Kritiiguptaa/BookWormed"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg hover:border-blue-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
