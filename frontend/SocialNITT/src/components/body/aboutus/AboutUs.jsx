import React, { useState, useEffect } from 'react';
import './AboutUs.css';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Anuj Tanwar",
      role: "Full Stack Developer & Project Lead",
      image: "/api/placeholder/300/300",
      bio: "Passionate about creating seamless user experiences and building robust backend systems that scale.",
      skills: ["React", "Node.js", "MongoDB", "Express", "AWS"],
      github: "https://github.com/anujtanwar",
      linkedin: "https://linkedin.com/in/anujtanwar",
      twitter: "https://twitter.com/anujtanwar"
    },
    {
      id: 2,
      name: "Suraj Patel",
      role: "Frontend Developer & UI/UX Designer",
      image: "/api/placeholder/300/300",
      bio: "Crafting beautiful and intuitive interfaces that users love to interact with every single day.",
      skills: ["React", "CSS3", "Figma", "JavaScript", "TypeScript"],
      github: "https://github.com/surajpatel",
      linkedin: "https://linkedin.com/in/surajpatel",
      twitter: "https://twitter.com/surajpatel"
    },
    {
      id: 3,
      name: "Dev Sharma",
      role: "Backend Developer & Database Architect",
      image: "/api/placeholder/300/300",
      bio: "Specializing in scalable backend architecture and efficient database design for modern applications.",
      skills: ["Node.js", "MongoDB", "Express", "API Design", "Docker"],
      github: "https://github.com/devsharma",
      linkedin: "https://linkedin.com/in/devsharma",
      twitter: "https://twitter.com/devsharma"
    }
  ];

  const features = [
    {
      icon: "🛍️",
      title: "Smart Marketplace",
      description: "AI-powered product recommendations and secure transactions within the NIT Trichy ecosystem.",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      icon: "🔧",
      title: "Service Hub",
      description: "Connect with skilled professionals and offer your expertise to the campus community.",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      icon: "🍕",
      title: "Food Discovery",
      description: "Discover hidden gems and share your favorite food spots with interactive reviews.",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      icon: "🏆",
      title: "Gamification",
      description: "Earn badges, climb leaderboards, and unlock exclusive rewards for your contributions.",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    },
    {
      icon: "🤖",
      title: "AI Assistant",
      description: "Get instant help with our intelligent chatbot that knows everything about campus life.",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
    },
    {
      icon: "🔒",
      title: "Secure Platform",
      description: "End-to-end encryption and verified user profiles ensure safe and trusted interactions.",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
    }
  ];

  const stats = [
    { number: "2,500+", label: "Active Students", icon: "👥" },
    { number: "5,000+", label: "Products Traded", icon: "📦" },
    { number: "1,200+", label: "Services Completed", icon: "⚡" },
    { number: "850+", label: "Food Reviews", icon: "⭐" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Final Year CSE",
      content: "SocialNITT completely transformed how I connect with my peers. Found my laptop, got tutoring help, and even discovered the best food spots on campus!",
      rating: 5,
      avatar: "/api/placeholder/80/80"
    },
    {
      name: "Rahul Kumar",
      role: "3rd Year ECE",
      content: "The points system is addictive in the best way! I've earned over 500 points just by helping fellow students and sharing resources.",
      rating: 5,
      avatar: "/api/placeholder/80/80"
    },
    {
      name: "Anjali Reddy",
      role: "2nd Year ME",
      content: "Love how easy it is to find services. Got my laptop repaired by a senior student at half the market price through SocialNITT!",
      rating: 5,
      avatar: "/api/placeholder/80/80"
    }
  ];

  const milestones = [
    { year: "2023", title: "Platform Launch", description: "SocialNITT goes live with basic marketplace features" },
    { year: "2024", title: "Service Hub", description: "Expanded to include comprehensive service marketplace" },
    { year: "2024", title: "AI Integration", description: "Launched intelligent chatbot and recommendation system" },
    { year: "2025", title: "Community Growth", description: "Reached 2,500+ active users across NIT Trichy" }
  ];

  return (
    <div className="about-container">
      {/* Hero Section with Animated Background */}
      <section className="hero-section" id="hero">
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>
        
        <div className={`hero-content ${isVisible.hero ? 'fade-in-up' : ''}`}>
          <h1 className="hero-title">
            Revolutionizing
            <span className="gradient-text"> Campus Life</span>
          </h1>
          <p className="hero-subtitle">
            Where innovation meets community. SocialNITT is the next-generation platform 
            connecting NIT Trichy students through smart technology and meaningful interactions.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary pulse">
              Explore Platform
              <span className="btn-icon">🚀</span>
            </button>
            <button className="btn-secondary">
              Watch Demo
              <span className="btn-icon">▶️</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Stats */}
      <section className="stats-section" id="stats">
        <div className={`stats-grid ${isVisible.stats ? 'slide-in' : ''}`}>
          {stats.map((stat, index) => (
            <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section with Parallax */}
      <section className="mission-section" id="mission">
        <div className="mission-container">
          <div className={`mission-content ${isVisible.mission ? 'fade-in-left' : ''}`}>
            <h2 className="section-title">Our Mission</h2>
            <p className="mission-text">
              We're on a mission to create the most vibrant, connected, and innovative campus 
              community in India. Through cutting-edge technology and user-centric design, 
              we're building bridges between students, fostering collaboration, and making 
              campus life more efficient and enjoyable.
            </p>
            <div className="mission-highlights">
              <div className="highlight">
                <span className="highlight-icon">🎯</span>
                <span>Student-First Approach</span>
              </div>
              <div className="highlight">
                <span className="highlight-icon">💡</span>
                <span>Innovation-Driven Solutions</span>
              </div>
              <div className="highlight">
                <span className="highlight-icon">🌱</span>
                <span>Sustainable Campus Living</span>
              </div>
            </div>
          </div>
          <div className={`mission-visual ${isVisible.mission ? 'fade-in-right' : ''}`}>
            <div className="floating-card">
              <div className="card-glow"></div>
              <div className="card-content">
                <h3>🎓 Built for Students</h3>
                <p>By students, for students. Every feature designed with campus life in mind.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with Hover Effects */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2 className="section-title">Platform Features</h2>
          <p className="section-subtitle">
            Discover the powerful features that make SocialNITT the ultimate campus companion
          </p>
        </div>
        
        <div className={`features-grid ${isVisible.features ? 'stagger-in' : ''}`}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-background" style={{ background: feature.gradient }}></div>
              <div className="feature-content">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
              <div className="feature-hover-effect"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section with 3D Cards */}
      <section className="team-section" id="team">
        <div className="section-header">
          <h2 className="section-title">Meet the Creators</h2>
          <p className="section-subtitle">
            The passionate team behind SocialNITT's success
          </p>
        </div>
        
        <div className={`team-grid ${isVisible.team ? 'zoom-in' : ''}`}>
          {teamMembers.map((member, index) => (
            <div 
              key={member.id} 
              className="team-card"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="card-3d">
                <div className="card-front">
                  <div className="member-avatar">
                    <div className="avatar-ring"></div>
                    <div className="avatar-image">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <div className="skills-preview">
                    {member.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div className="card-back">
                  <p className="member-bio">{member.bio}</p>
                  <div className="member-skills">
                    {member.skills.map((skill, i) => (
                      <span key={i} className="skill-pill">{skill}</span>
                    ))}
                  </div>
                  <div className="social-links">
                    <a href={member.github} className="social-link github">
                      <span>📱</span>
                    </a>
                    <a href={member.linkedin} className="social-link linkedin">
                      <span>💼</span>
                    </a>
                    <a href={member.twitter} className="social-link twitter">
                      <span>🐦</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section" id="timeline">
        <div className="section-header">
          <h2 className="section-title">Our Journey</h2>
          <p className="section-subtitle">Key milestones in SocialNITT's evolution</p>
        </div>
        
        <div className={`timeline ${isVisible.timeline ? 'animate-timeline' : ''}`}>
          {milestones.map((milestone, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="timeline-year">{milestone.year}</div>
                <h3 className="timeline-title">{milestone.title}</h3>
                <p className="timeline-description">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-header">
          <h2 className="section-title">What Students Say</h2>
          <p className="section-subtitle">Real feedback from our amazing community</p>
        </div>
        
        <div className="testimonials-container">
          <div className="testimonial-card active">
            <div className="testimonial-content">
              <div className="stars">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <span key={i} className="star">⭐</span>
                ))}
              </div>
              <p className="testimonial-text">"{testimonials[currentTestimonial].content}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonials[currentTestimonial].name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="author-info">
                  <h4>{testimonials[currentTestimonial].name}</h4>
                  <p>{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="cta">
        <div className="cta-background">
          <div className="cta-particles"></div>
        </div>
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Campus Experience?</h2>
          <p className="cta-subtitle">
            Join thousands of students who are already making the most of their college life
          </p>
          <div className="cta-buttons">
            <button className="btn-primary glow">
              Start Your Journey
              <span className="btn-sparkle">✨</span>
            </button>
            <button className="btn-outline">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;