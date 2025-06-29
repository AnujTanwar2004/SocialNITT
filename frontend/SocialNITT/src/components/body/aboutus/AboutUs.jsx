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
      role: "Full Stack Developer & Project BAckend Lead",
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
    },
     {
      id: 4,
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
    { number: "2+", label: "Active Students", icon: "👥" },
    { number: "5+", label: "Products Traded", icon: "📦" },
    { number: "1+", label: "Services Completed", icon: "⚡" },
    { number: "12+", label: "Food Reviews", icon: "⭐" }
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
    { year: "2025", title: "Platform Launch", description: "SocialNITT goes live with basic marketplace features" },
     { year: "2025", title: "AI Integration", description: "Launched intelligent chatbot and recommendation system" },
    { year: "2025", title: "Community Growth", description: "Reached 2 + active users across NIT Trichy" }
  ];

  return (
    <div className="about-container">
      {/* Hero Section with Animated Background */}
      <section className="hero-section-about" id="hero">
        <div className="hero-background-about">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>
        
        <div className={`hero-content-about ${isVisible.hero ? 'fade-in-up-about' : ''}`}>
          <h1 className="hero-title-about">
            Revolutionizing
            <span className="gradient-text-about"> Campus Life</span>
          </h1>
          <p className="hero-subtitleabout-about">
            Where innovation meets community. SocialNITT is the next-generation platform 
            connecting NIT Trichy students through smart technology and meaningful interactions.
          </p>
          <div className="hero-buttons-about">
            <button className="btn-primary-about pulse-about">
              Explore Platform
              <span className="btn-icon-about">🚀</span>
            </button>
            <button className="btn-secondary-about">
              Watch Demo
              <span className="btn-icon-about">▶️</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Stats */}
      <section className="stats-section-about" id="stats">
        <div className={`stats-grid ${isVisible.stats ? 'slide-in' : ''}`}>
          {stats.map((stat, index) => (
            <div key={index} className="stat-card-about" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="stat-icon-about">{stat.icon}</div>
              <div className="stat-number-about">{stat.number}</div>
              <div className="stat-label-about">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section with Parallax */}
      <section className="mission-section-about" id="mission">
        <div className="mission-container-about">
          <div className={`mission-content-about ${isVisible.mission ? 'fade-in-left-about' : ''}`}>
            <h2 className="section-title-about">Our Mission</h2>
            <p className="mission-text-about">
              We're on a mission to create the most vibrant, connected, and innovative campus 
              community in India. Through cutting-edge technology and user-centric design, 
              we're building bridges between students, fostering collaboration, and making 
              campus life more efficient and enjoyable.
            </p>
            <div className="mission-highlights-about ">
              <div className="highlight-about ">
                <span className="highlight-icon-about">🎯</span>
                <span>Student-First Approach</span>
              </div>
              <div className="highlight-about">
                <span className="highlight-icon-about">💡</span>
                <span>Innovation-Driven Solutions</span>
              </div>
              <div className="highlight-about">
                <span className="highlight-icon-about">🌱</span>
                <span>Sustainable Campus Living</span>
              </div>
            </div>
          </div>
          <div className={`mission-visual-about ${isVisible.mission ? 'fade-in-right-about' : ''}`}>
            <div className="floating-card-about">
              <div className="card-glow-about"></div>
              <div className="card-content-about">
                <h3>🎓 Built for Students</h3>
                <p>By students, for students. Every feature designed with campus life in mind.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with Hover Effects */}
      <section className="features-section-about" id="features">
        <div className="section-header-about">
          <h2 className="section-title-about">Platform Features</h2>
          <p className="section-subtitle-about">
            Discover the powerful features that make SocialNITT the ultimate campus companion
          </p>
        </div>
        
        <div className={`features-grid-about ${isVisible.features ? 'stagger-in-about' : ''}`}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card-about"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-background-about" style={{ background: feature.gradient }}></div>
              <div className="feature-content-about">
                <div className="feature-icon-about">{feature.icon}</div>
                <h3 className="feature-title-about">{feature.title}</h3>
                <p className="feature-description-about">{feature.description}</p>
              </div>
              <div className="feature-hover-effect-about"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section with 3D Cards */}
      <section className="team-section-about" id="team">
        <div className="section-header-about">
          <h2 className="section-title-about">Meet the Creators</h2>
          <p className="section-subtitle-about">
            The passionate team behind SocialNITT's success
          </p>
        </div>
        
        <div className={`team-grid-about ${isVisible.team ? 'zoom-in-about' : ''}`}>
          {teamMembers.map((member, index) => (
            <div 
              key={member.id} 
              className="team-card-about"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="card-3d-about">
                <div className="card-front-about">
                  <div className="member-avatar-about">
                    <div className="avatar-ring-about"></div>
                    <div className="avatar-image-about">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <h3 className="member-name-about">{member.name}</h3>
                  <p className="member-role-about">{member.role}</p>
                  <div className="skills-preview-about">
                    {member.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="skill-tag-about">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div className="card-back-about">
                  <p className="member-bio-about">{member.bio}</p>
                  <div className="member-skills-about">
                    {member.skills.map((skill, i) => (
                      <span key={i} className="skill-pill-about">{skill}</span>
                    ))}
                  </div>
                  <div className="social-links-about">
                    <a href={member.github} className="social-link-about github-about">
                      <span>📱</span>
                    </a>
                    <a href={member.linkedin} className="social-link-about linkedin-about">
                      <span>💼</span>
                    </a>
                    <a href={member.twitter} className="social-link-about twitter-about">
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
      <section className="timeline-section-about" id="timeline">
        <div className="section-header-about">
          <h2 className="section-title-about">Our Journey</h2>
          <p className="section-subtitle-about">Key milestones in SocialNITT's evolution</p>
        </div>
        
        <div className={`timeline-about ${isVisible.timeline ? 'animate-timeline-about' : ''}`}>
          {milestones.map((milestone, index) => (
            <div key={index} className="timeline-item-about">
              <div className="timeline-marker-about"></div>
              <div className="timeline-content-about">
                <div className="timeline-year-about">{milestone.year}</div>
                <h3 className="timeline-title-about">{milestone.title}</h3>
                <p className="timeline-description-about">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="testimonials-section-about" id="testimonials">
        <div className="section-header-about">
          <h2 className="section-title-about">What Students Say</h2>
          <p className="section-subtitle-about">Real feedback from our amazing community</p>
        </div>
        
        <div className="testimonials-container-about">
          <div className="testimonial-card-about active">
            <div className="testimonial-content-about">
              <div className="stars-about">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <span key={i} className="star-about">⭐</span>
                ))}
              </div>
              <p className="testimonial-text-about">"{testimonials[currentTestimonial].content}"</p>
              <div className="testimonial-author-about">
                <div className="author-avatar-about">
                  {testimonials[currentTestimonial].name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="author-info-about">
                  <h4>{testimonials[currentTestimonial].name}</h4>
                  <p>{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-dots-about">
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
      <section className="cta-section-about" id="cta">
        <div className="cta-background-about">
          <div className="cta-particles-about"></div>
        </div>
        <div className="cta-content-about">
          <h2 className="cta-title-about">Ready to Transform Your Campus Experience?</h2>
          <p className="cta-subtitle-about">
            Join thousands of students who are already making the most of their college life
          </p>
          <div className="cta-buttons-about">
            <button className="btn-primary glow-about">
             
              <a href="/login" className="btn-primary"> Start Your Journey</a>
              <span className="btn-sparkle-about">✨</span>
            </button>
            <button className="btn-outline-about">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;