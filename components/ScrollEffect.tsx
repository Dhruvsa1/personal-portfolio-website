'use client';

import { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronDown } from '@fortawesome/free-solid-svg-icons';
import { AuroraText } from './ui/aurora-text';
import { TypingAnimation } from './ui/typing-animation';
import './ScrollEffect.css';

interface WordStyle {
  word: string;
  fontSize: string;
  animationDelay: string;
  fadeInDelay: string;
  left: string;
  top: string;
}

export default function ScrollEffect() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showNameReveal, setShowNameReveal] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [showSocials, setShowSocials] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [skipButtonOut, setSkipButtonOut] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [wordStyles, setWordStyles] = useState<WordStyle[]>([]);
  const [revealedElements, setRevealedElements] = useState<Set<string>>(new Set());
  const [showExperience1, setShowExperience1] = useState(false);
  const [profileImageSrc, setProfileImageSrc] = useState<string>('https://website-file-manager.b-cdn.net/Website%20Assets/IMG_3473.jpg');
  const [showProfilePlaceholder, setShowProfilePlaceholder] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Random tech/portfolio words for the loading animation
  const loadingWords = useMemo(() => [
    'React', 'TypeScript', 'Next.js', 'JavaScript', 'CSS',
    'HTML', 'Node.js', 'Git', 'Tailwind', 'UI/UX',
    'Design', 'Frontend', 'Backend', 'API', 'Database',
    'MongoDB', 'PostgreSQL', 'Python', 'Java', 'Docker',
    'AWS', 'Firebase', 'Vercel', 'GraphQL', 'REST',
    'Responsive', 'Animation', 'Performance', 'SEO', 'Testing',
    'Agile', 'Scrum', 'CI/CD', 'DevOps', 'Security',
    'Accessibility', 'Redux', 'Context', 'Hooks', 'Components',
    'State', 'Props', 'Async', 'Promise', 'OAuth',
    'JWT', 'Webpack', 'Vite', 'npm', 'yarn'
  ], []);
  
  // Generate stable random styles only on client-side mount
  useEffect(() => {
    const styles = loadingWords.map((word, index) => ({
      word,
      fontSize: `${Math.random() * 2 + 4}vmin`,
      animationDelay: `${Math.random() * -4}s`,
      fadeInDelay: `${index * 0.05}s`, // Staggered fade-in (0s, 0.05s, 0.1s, etc.)
      left: `${Math.random() * 60 + 20}%`, // Random position between 20% and 80%
      top: `${Math.random() * 60 + 20}%`   // Random position between 20% and 80%
    }));
    setWordStyles(styles);
  }, [loadingWords]);
  
  // Disable scrolling during loading, enable after
  useEffect(() => {
    if (!loadingComplete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [loadingComplete]);

  // Scroll spy - detect active section
  useEffect(() => {
    if (!loadingComplete) return;

    const handleScroll = () => {
          // Added career-goals to scroll spy
          const sections = ['home', 'about', 'career-goals', 'project-showcase', 'resume'];
      const scrollPosition = window.scrollY + 100; // Offset for navbar

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingComplete]);

  // Scroll reveal animation observer
  useEffect(() => {
    if (!loadingComplete) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const elementId = entry.target.getAttribute('data-reveal-id');
          if (elementId) {
            setRevealedElements(prev => new Set([...prev, elementId]));
          }
        }
      });
    }, observerOptions);

    // Observe all elements with data-reveal-id attribute
    const revealElements = document.querySelectorAll('[data-reveal-id]');
    revealElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      revealElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [loadingComplete]);


  // Auto-play the loading animation
  useEffect(() => {
    if (!loadingComplete) {
      // Start fade out before completing
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
        setSkipButtonOut(true); // Animate skip button out
      }, 5000); // Start fading at 5 seconds

      // Complete loading and show final reveal
      const completeTimer = setTimeout(() => {
        setLoadingComplete(true);
        // Trigger name reveal after transition
        setTimeout(() => {
          setShowNameReveal(true);
          // Show typing animation after name is fully revealed
          setTimeout(() => {
            setShowTyping(true);
            // Show socials shortly after typing starts
            setTimeout(() => setShowSocials(true), 1500);
          }, 2000);
        }, 800);
      }, 6500); // 6.5 seconds total

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [loadingComplete]);

  const handleSkip = () => {
    setFadeOut(true);
    setSkipButtonOut(true); // Animate skip button out
    // Fast-forward to the same staged sequence as autoplay
    setTimeout(() => {
      setLoadingComplete(true);
      // Keep the same timings as the normal flow
      setTimeout(() => {
        setShowNameReveal(true);
        setTimeout(() => {
          setShowTyping(true);
          setTimeout(() => setShowSocials(true), 1500);
        }, 2000);
      }, 800);
    }, 100);
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Copy to clipboard function with toast notification
  const copyToClipboard = async (text: string, message: string = 'Copied to clipboard!') => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage(message);
      setShowToast(true);
      // Hide toast after 2 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setToastMessage('Failed to copy');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
  };

  return (
    <>
      {/* Starfield Background */}
      <div className="starfield-container">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
      </div>

      {/* Navigation Menu */}
      {loadingComplete && (
        <nav className="top-nav">
          <div className="nav-logo">DD</div>
          <div className="nav-links">
            <button onClick={() => scrollToSection('home')} className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>Home</button>
            <button onClick={() => scrollToSection('about')} className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}>About Me</button>
            <button onClick={() => scrollToSection('career-goals')} className={`nav-link ${activeSection === 'career-goals' ? 'active' : ''}`}>Career Goals</button>
            <button onClick={() => scrollToSection('project-showcase')} className={`nav-link ${activeSection === 'project-showcase' ? 'active' : ''}`}>Project Showcase</button>
            <button onClick={() => scrollToSection('resume')} className={`nav-link ${activeSection === 'resume' ? 'active' : ''}`}>Resume</button>
            {/* Projects tab hidden - might add back later if owner wants */}
            {/* <button onClick={() => scrollToSection('projects')} className={`nav-link nav-link-projects ${activeSection === 'projects' ? 'active' : ''}`}>Projects</button> */}
          </div>
        </nav>
      )}

      {/* Loading Animation */}
      {!loadingComplete && wordStyles.length > 0 && (
        <div className={`loading-animation ${fadeOut ? 'fade-out' : ''}`}>
          <div className="stuck-grid">
            {wordStyles.map((style, index) => (
              <div 
                key={index} 
                className="grid-item loading-word"
                style={{
                  fontSize: style.fontSize,
                  left: style.left,
                  top: style.top,
                  animationDelay: `${style.fadeInDelay}, ${style.animationDelay}`
                }}
              >
                {style.word}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Home Section - Final DD with Name Reveal */}
      {loadingComplete && (
        <section id="home" className="page-section home-section">
          <div className="final-reveal fade-in">
            <div className={`stuck-grid final-grid`}>
              <div className={`grid-item name-reveal ${showNameReveal ? 'show-name' : ''}`}>
              <h1 className="aurora-text-content">
                <AuroraText 
                  className="big-d"
                  colors={["#ffffff", "#22d3ee", "#3b82f6", "#8b5cf6", "#60a5fa", "#a78bfa"]}
                  speed={1.2}
                >
                  D
                </AuroraText>
                <span className="slide-out slide-out-first">hruvsai</span>
                <span className="name-spacer"></span>
                <AuroraText 
                  className="big-d"
                  colors={["#ffffff", "#22d3ee", "#3b82f6", "#8b5cf6", "#60a5fa", "#a78bfa"]}
                  speed={1.2}
                >
                  D
                </AuroraText>
                <span className="slide-out slide-out-second">hulipudi</span>
              </h1>
              
              {/* Typing Animation - Introduction Text */}
              <div className={`intro-text ${showTyping ? 'visible' : ''}`}>
                {showTyping && (
                  <TypingAnimation
                    className="typing-intro"
                    typeSpeed={80}
                    showCursor={true}
                    blinkCursor={true}
                    startOnView={false}
                  >
                    Full-stack developer passionate about creating elegant solutions to complex problems
                  </TypingAnimation>
                )}
              </div>
              
              {/* Social Links */}
              {showSocials && (
                <div className="socials-container">
                  {/* LinkedIn */}
                  <a href="https://www.linkedin.com/in/dhruvsai-dhulipudi-259a83293/" target="_blank" rel="noopener noreferrer" className="social-link">
                    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  
                  {/* GitHub */}
                  <a href="https://github.com/Dhruvsa1/Personal-Portfolio" target="_blank" rel="noopener noreferrer" className="social-link">
                    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  
                  {/* School Email */}
                  <button 
                    onClick={() => copyToClipboard('ddhulipudi3@gatech.edu')} 
                    className="social-link email-link school-email"
                    title="Copy school email to clipboard"
                  >
                    <div className="letter-image">
                      <div className="animated-mail">
                        <div className="back-fold"></div>
                        <div className="letter">
                          <div className="letter-border"></div>
                          <div className="letter-title"></div>
                          <div className="letter-context"></div>
                          <div className="letter-stamp">
                            <div className="letter-stamp-inner"></div>
                          </div>
                        </div>
                        <div className="top-fold"></div>
                        <div className="body"></div>
                        <div className="left-fold"></div>
                      </div>
                      <div className="shadow">                      </div>
                    </div>
                  </button>
                  
                  {/* Phone */}
                  <button 
                    onClick={() => copyToClipboard('4703573785', 'Phone number copied!')} 
                    className="social-link"
                    title="Copy phone number to clipboard"
                  >
                    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 22.621l-3.521-6.795c-.008.004-1.974.97-2.064 1.011-2.24 1.086-6.799-7.82-4.609-8.994l2.083-1.026-3.493-6.817-2.106 1.039c-7.202 3.755 4.233 25.982 11.6 22.615.121-.055 2.102-1.029 2.11-1.033z"/>
                    </svg>
                  </button>
                  
                  {/* Resume */}
                  <a href="https://drive.google.com/file/d/1lB2u6K1f3o5IvdyWAFXVCZOQA5uAL39s/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="social-link">
                    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.363 2c4.155 0 2.637 6 2.637 6s6-1.65 6 2.457v11.543h-16v-20h7.363zm.826-2h-10.189v24h20v-14.386c0-2.391-6.648-9.614-9.811-9.614zm4.811 13h-2.628v3.686h.907v-1.472h1.49v-.732h-1.49v-.698h1.721v-.784zm-4.9 0h-1.599v3.686h1.599c.537 0 .961-.181 1.262-.535.555-.658.587-2.034-.062-2.692-.298-.3-.712-.459-1.2-.459zm-.692.783h.496c.473 0 .802.173.915.644.064.267.077.679-.021.948-.128.351-.381.528-.754.528h-.637v-2.12zm-2.74-.783h-1.668v3.686h.907v-1.277h.761c.619 0 1.064-.277 1.224-.763.095-.291.095-.597 0-.885-.16-.484-.606-.761-1.224-.761zm-.761.732h.546c.235 0 .467.028.576.228.067.123.067.366 0 .489-.109.199-.341.227-.576.227h-.546v-.944z"/>
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
          </div>
        </section>
      )}

      

      {/* About Me Section */}
      {loadingComplete && (
        <section id="about" className="page-section content-section">
          <div className="about-container">
            <div className="about-header">
              <h2 className="section-title">About Me</h2>
            </div>
            
            <div className="about-content two-pane">
              {/* Left Sidebar */}
              <aside className="about-sidebar">
                <div className="profile-card">
                  <div className="profile-image-container">
                    {!showProfilePlaceholder ? (
                      <img 
                        src={profileImageSrc}
                        alt="Dhruvsai Dhulipudi"
                        className="profile-image"
                        onError={() => {
                          // If image fails to load, show placeholder
                          setShowProfilePlaceholder(true);
                        }}
                      />
                    ) : (
                    <div className="profile-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    )}
                  </div>
                </div>
                {/* Name + Education stacked */}
                <div className="sidebar-section">
                  <h3 className="sidebar-name">Dhruvsai Dhulipudi</h3>
                  <div className="education-card compact">
                    <h3 className="card-title">
                      <span className="card-icon">🎓</span>
                      Education
                    </h3>
                    <div className="education-details">
                      <div className="school-name">Georgia Institute of Technology</div>
                      <div className="degree">B.S. in Computer Engineering</div>
                      <div className="gpa">GPA: 3.85/4.0 • Dec 2027</div>
                      <div className="location">Atlanta, GA</div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Right Content */}
              <main className="about-main-content">
                {/* Header with Contact Information */}
                <div className="about-content-section">
                  <div className="about-header-info">
                    <h1 className="about-name">Dhruvsai Dhulipudi</h1>
                    <div className="contact-info">
                      <span>US Citizen</span>
                      <span>|</span>
                      <a href="mailto:ddhulipudi3@gatech.edu" className="contact-link">ddhulipudi3@gatech.edu</a>
                      <span>|</span>
                      <a href="tel:4703573785" className="contact-link">4703573785</a>
                      <span>|</span>
                      <a href="https://www.linkedin.com/in/dhruvsai-dhulipudi-259a83293/" target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn: Dhruvsai Dhulipudi</a>
                      <span>|</span>
                      <a href="https://github.com/dhruvsa1" target="_blank" rel="noopener noreferrer" className="contact-link">GitHub: dhruvsa1</a>
                    </div>
                  </div>
                  
                  {/* Expanded Bio Narrative */}
                  <div className="bio-narrative mt-8 mb-4 text-gray-300 leading-relaxed space-y-4">
                    <p>
                      Hello! I am an aspiring software engineer blending a deep curiosity for both software algorithms and hardware engineering. My journey into technology started with an innate desire to understand how complex systems operate under the hood, leading me to pursue a Bachelor of Science in Computer Engineering at the Georgia Institute of Technology. Through rigorous coursework in Data Structures &amp; Algorithms, Object-Oriented Programming, and Physics, I have cultivated a strong foundation for tackling ambiguous, open-ended problems effectively.
                    </p>
                    <p>
                      During my time in the FIRST Robotics Competition, I had the incredible opportunity to serve as the Programming and CAD Subcommittee Lead, ultimately qualifying for the World Championships. Working extensively with Java, C++, ROS, and computer vision on embedded systems like the Raspberry Pi completely shifted my perspective on what's possible when software meets the physical world. Since then, I've expanded my horizons into full-stack web development and AI. Recently, during my internship at KKTutors, I migrated a complex Angular frontend to a modernized React architecture, cutting load times significantly, and successfully deployed scalable REST APIs using the MERN stack. I also leveraged state-of-the-art AI models through the OpenAI API to construct an automated problem generator, drastically reducing curriculum development time.
                    </p>
                    <p>
                      Beyond the screen, I am fiercely driven by the impact technology can have on everyday life. Whether I am building an iOS application equipped with Firebase real-time updates to monitor dorm laundry availability, or developing a custom-built, autonomous tracking drone programmed with YOLOv8, I am always seeking out cutting-edge projects that push my technical boundaries. Through a combination of perseverance, continuous learning, and an unyielding commitment to delivering elegant solutions, my ultimate vision is to leverage my multidisciplinary background to shape and lead impactful technical products from conceptualization to execution.
                    </p>
                  </div>
                </div>

                {/* Education Section */}
                <div className="about-content-section">
                  <h2 className="content-section-title">Education</h2>
                  <div className="info-block">
                    <div className="info-header">
                      <h3 className="info-title">Georgia Institute of Technology</h3>
                      <span className="info-location">Atlanta, GA</span>
                    </div>
                    <div className="info-subtitle">Bachelor of Science in Computer Engineering | GPA: 3.85/4.0</div>
                    <div className="info-date">Expected Graduation: Dec 2027</div>
                    <ul className="info-list">
                      <li>Relevant Coursework: Linear Algebra, Multivariable Calculus, Combinatorics, Differential Equations, Discrete Mathematics, Data Structures & Algorithms, Object-Oriented Programming, Physics I & II</li>
                    </ul>
                  </div>
                </div>

                {/* Experience Section */}
                <div className="about-content-section">
                  <h2 className="content-section-title">Experience</h2>
                  <div className="info-block group relative p-8 -mx-8 rounded-3xl transition-all duration-700 hover:bg-white/[0.04] border border-transparent hover:border-white/10 overflow-hidden shadow-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="project-content-grid relative z-10 flex flex-col md:flex-row gap-8 items-center mb-6">
                      <div className="project-image-wrapper flex-shrink-0 relative overflow-hidden group-hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] transition-all duration-700 w-full md:w-[320px] rounded-2xl border border-white/10 group-hover:border-emerald-500/20">
                        <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        <img src="/visuals/kktutors1.png" alt="KKTutors Development Environment" className="w-full h-auto block transform-gpu transition-transform duration-1000 ease-in-out group-hover:scale-110" />
                      </div>
                      <div className="project-details flex-1">
                        <div className="info-header mb-2 flex flex-col sm:flex-row sm:items-center justify-between">
                          <div>
                            <h3 className="info-title text-3xl font-extrabold text-white tracking-tight transition-colors group-hover:text-emerald-400">KKTutors</h3>
                            <div className="text-gray-400 text-sm mt-1 mb-2 sm:mb-0">Suwanee, GA • May 2025 – June 2025</div>
                          </div>
                          <div>
                            <a href="https://kktutors.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2 text-sm font-bold tracking-wide text-black bg-white rounded-full hover:bg-emerald-400 hover:text-black transition-all shadow-lg hover:shadow-emerald-500/20 hover:scale-105 active:scale-95 duration-300 group/btn">
                              Visit Project <span className="ml-2 font-sans font-bold transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1">↗</span>
                            </a>
                          </div>
                        </div>
                        <div className="info-subtitle text-emerald-300/80 font-medium text-lg mb-4">Full Stack Website Developer Intern</div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {"React, Node.js, MongoDB, Express, Python, AWS".split(', ').map((tech, i) => (
                            <span key={i} className="text-[11px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full bg-white/5 text-gray-300 border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-emerald-500/20 hover:text-emerald-200 hover:border-emerald-500/30 hover:-translate-y-0.5 whitespace-nowrap">{tech}</span>
                          ))}
                        </div>
                        <ul className="info-list mt-3 text-gray-300/90 leading-relaxed">
                      <li>Led the migration of the tutoring platform's frontend from Angular to React, modernizing the UI architecture, improving load times by 40%, and enabling reusable components.</li>
                      <li>Built and maintained full-stack web applications for a tutoring platform serving 100+ active students, leveraging the MERN stack (MongoDB, Express.js, React, Node.js) to deliver scalable REST APIs and responsive UIs.</li>
                      <li>Developed AI-powered problem generator and assessment software using Python, Flask, MongoDB, and the OpenAI API, reducing manual test creation time by 80%.</li>
                      <li>Implemented real-time analytics dashboards tracking performance metrics across 100+ students using React state management and Node.js APIs with sub-200ms latency.</li>
                      <li>Deployed and managed web services on AWS Lightsail using containerized environments for high availability and scalable infrastructure.</li>
                      <li>Applied best practices in version control, debugging, and agile iteration, cutting bug resolution time by 30%.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Projects Section */}
                <div className="about-content-section">
                  <h2 className="content-section-title">Projects</h2>
                  
                  <div className="info-block project-with-image mb-16 group relative p-8 -mx-8 rounded-3xl transition-all duration-700 hover:bg-white/[0.04] border border-transparent hover:border-white/10 overflow-hidden shadow-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
                    <div className="absolute inset-0 bg-gradient-to-l from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="project-content-grid relative z-10 flex flex-col md:flex-row-reverse gap-10 items-center">
                      <div className="project-image-wrapper flex-shrink-0 relative overflow-hidden group-hover:shadow-[0_0_40px_rgba(99,102,241,0.1)] transition-all duration-700 w-full md:w-[380px] rounded-2xl border border-white/10 group-hover:border-indigo-500/20">
                        <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        <img src="/visuals/projectnonfiction.png" alt="Project Nonfiction Streaming App" className="w-full h-auto block transform-gpu transition-transform duration-1000 ease-in-out group-hover:scale-110" />
                      </div>
                      <div className="project-details flex-1">
                        <div className="info-header mb-4 flex flex-col sm:flex-row sm:items-center justify-between">
                          <div>
                            <h3 className="info-title text-3xl font-extrabold text-white tracking-tight transition-colors group-hover:text-indigo-400">Project Nonfiction</h3>
                            <div className="text-gray-400 text-sm mt-2">PNF V2</div>
                          </div>
                          <div className="mt-4 sm:mt-0">
                            <a href="https://projectnonfiction.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2 text-sm font-bold tracking-wide text-black bg-white rounded-full hover:bg-indigo-400 hover:text-white transition-all shadow-lg hover:shadow-indigo-500/20 hover:scale-105 active:scale-95 duration-300 group/btn">
                              Visit Project <span className="ml-2 font-sans font-bold transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1">↗</span>
                            </a>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-5">
                          {"Next.js 16, TypeScript, Tailwind, Supabase, Bunny Stream".split(', ').map((tech, i) => (
                            <span key={i} className="text-[11px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full bg-white/5 text-gray-300 border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-indigo-500/20 hover:text-indigo-200 hover:border-indigo-500/30 hover:-translate-y-0.5 whitespace-nowrap">{tech}</span>
                          ))}
                        </div>
                        <p className="mb-4 text-gray-300/90 leading-relaxed text-[15px]">Project Nonfiction is a feature-rich, full-stack documentary streaming platform designed to help viewers learn about real-world topics through high-quality film. The application acts as a comprehensive content management system equipped with automated ingestion webhooks and a scheduled release hierarchy.</p>
                        <ul className="info-list text-gray-400 text-sm leading-relaxed">
                          <li>Developed a robust user authentication and paywall workflow utilizing Supabase Auth with granular role-based access control (RBAC), mapped to hierarchical tiers like Premium and VIP.</li>
                          <li>Engineered an extensive administrative dashboard using Recharts for analytics, facilitating the management of dynamic content such as modular series hierarchies and custom collections.</li>
                          <li>Implemented secure, short-TTL tokenized HLS video playback integrations via Bunny Stream supported by Redis rate-limiting constructs.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="info-block project-with-image mb-16 group relative p-8 -mx-8 rounded-3xl transition-all duration-700 hover:bg-white/[0.04] border border-transparent hover:border-white/10 overflow-hidden shadow-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
                    <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="project-content-grid relative z-10 flex flex-col md:flex-row gap-10 items-center">
                      <div className="project-image-wrapper flex-shrink-0 relative overflow-hidden group-hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] transition-all duration-700 w-full md:w-[380px] rounded-2xl border border-white/10 group-hover:border-cyan-500/20">
                        <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        <img src="/visuals/antijoblessness.png" alt="AntiJobless Analytics Dashboard" className="w-full h-auto block transform-gpu transition-transform duration-1000 ease-in-out group-hover:scale-110" />
                      </div>
                      <div className="project-details flex-1">
                        <div className="info-header mb-4">
                          <h3 className="info-title text-3xl font-extrabold text-white tracking-tight transition-colors group-hover:text-cyan-400">Anti-Joblessness</h3>
                          <div className="text-gray-400 text-sm mt-2">AI Resume & Application Tailoring Tool</div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-5">
                          {"Next.js, Supabase, Anthropic API, LaTeX pipeline".split(', ').map((tech, i) => (
                            <span key={i} className="text-[11px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full bg-white/5 text-gray-300 border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-cyan-500/20 hover:text-cyan-200 hover:border-cyan-500/30 hover:-translate-y-0.5 whitespace-nowrap">{tech}</span>
                          ))}
                        </div>
                        <p className="mb-4 text-gray-300/90 leading-relaxed text-[15px]">Anti-Joblessness is an all-in-one web platform acting as a highly capable job search companion tailored for students hunting for internships and full-time roles. The system brilliantly merges structured application funnel tracking with powerful, AI-driven LaTeX resume tailoring functionality.</p>
                        <ul className="info-list text-gray-400 text-sm leading-relaxed">
                          <li>Integrated Anthropic's Claude to algorithmically parse abstract job descriptions, tailoring underlying LaTeX resume templates directly to ATS keyword requirements flawlessly.</li>
                          <li>Designed an interactive 'Studio' workbench that provides targeted metric scoring along dimensions like writing quality and returns precise bullet-level feedback with change logs tracking specific iterations.</li>
                          <li>Constructed a Postgres-backed CRM using Supabase to manage user telemetry, tracking application lifecycles from submission to offer stages along with generative usage accounting logs.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="info-block project-with-image mb-16 group relative p-8 -mx-8 rounded-3xl transition-all duration-700 hover:bg-white/[0.04] border border-transparent hover:border-white/10 overflow-hidden shadow-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <div className="project-content-grid relative z-10 flex flex-col md:flex-row-reverse gap-10 items-center">
                      <div className="project-image-wrapper flex-shrink-0 relative overflow-hidden group-hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] transition-all duration-700 w-full md:w-[320px] rounded-2xl border border-white/10 group-hover:border-amber-500/20">
                        <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        <img src="/visuals/save1.png" alt="Sav3 Mobile Application Swipe UI" className="w-full h-auto block transform-gpu transition-transform duration-1000 ease-in-out group-hover:scale-110" />
                      </div>
                      <div className="project-details flex-1">
                        <div className="info-header mb-4 flex flex-col sm:flex-row sm:items-center justify-between">
                          <div>
                            <h3 className="info-title text-3xl font-extrabold text-white tracking-tight transition-colors group-hover:text-amber-400">Sav3</h3>
                            <div className="text-gray-400 text-sm mt-2">Credit Card Discovery Platform</div>
                          </div>
                          <div className="mt-4 sm:mt-0">
                            <a href="https://save.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2 text-sm font-bold tracking-wide text-black bg-white rounded-full hover:bg-amber-400 hover:text-black transition-all shadow-lg hover:shadow-amber-500/20 hover:scale-105 active:scale-95 duration-300 group/btn">
                              Visit Project <span className="ml-2 font-sans font-bold transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1">↗</span>
                            </a>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-5">
                          {"React Native, Expo, TypeScript, Supabase Edge Functions".split(', ').map((tech, i) => (
                            <span key={i} className="text-[11px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full bg-white/5 text-gray-300 border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-amber-500/20 hover:text-amber-200 hover:border-amber-500/30 hover:-translate-y-0.5 whitespace-nowrap">{tech}</span>
                          ))}
                        </div>
                        <p className="mb-4 text-gray-300/90 leading-relaxed text-[15px]">Sav3 is an intuitive mobile application built for browsing and curating credit card offers using engaging swipe deck mechanics. The experience heavily relies on individual user preference onboarding metrics to calculate highly personalized, dynamically ordered recommendation models.</p>
                        <ul className="info-list text-gray-400 text-sm leading-relaxed">
                          <li>Developed a fluid, gesture-driven mobile UI using React Native Reanimated, creating highly responsive right-swipe (save) and left-swipe (pass) interaction event listeners.</li>
                          <li>Engineered an adaptive, behavioral ranking algorithm that leverages tracking events to adjust the deck hierarchy dynamically, seamlessly elevating cards tailored to personal annual-fee preferences to the top.</li>
                          <li>Integrated Supabase Edge Functions paired with internal AI generations to provide contextualized "sparkle" insights detailing dynamic match percentages on top cards.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="info-block group relative p-5 -mx-5 rounded-2xl transition-all duration-500 hover:bg-white/[0.03] border border-transparent hover:border-white/10 mb-6">
                    <div className="info-header mb-3 text-white">
                      <h3 className="info-title text-xl font-bold transition-colors">GTDormLaundry</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {"SwiftUI, Firebase, REST API".split(', ').map((tech, i) => (
                          <span key={i} className="text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10 backdrop-blur-md transition-all hover:bg-white/10 whitespace-nowrap">{tech}</span>
                        ))}
                      </div>
                    </div>
                    <ul className="info-list">
                      <li>Developed an iOS app using SwiftUI to monitor washer/dryer availability with real-time Firebase updates.</li>
                      <li>Implemented state management and push notifications for cycle completion and machine status.</li>
                      <li>Designed backend schema for session tracking, machine logging, and IoT extensibility.</li>
                      <li>Integrated camera-based scanning for fast student check-ins.</li>
                    </ul>
                  </div>

                  <div className="info-block group relative p-5 -mx-5 rounded-2xl transition-all duration-500 hover:bg-white/[0.03] border border-transparent hover:border-white/10 mb-6">
                    <div className="info-header mb-3 text-white">
                      <h3 className="info-title text-xl font-bold transition-colors">Local Whisper Transcriber</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {"Python, Rust, Faster-Whisper, CTranslate2".split(', ').map((tech, i) => (
                          <span key={i} className="text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10 backdrop-blur-md transition-all hover:bg-white/10 whitespace-nowrap">{tech}</span>
                        ))}
                      </div>
                    </div>
                    <ul className="info-list">
                      <li>Built an offline audio-to-text transcription app using Whisper + Faster-Whisper supporting GPU/CPU inference.</li>
                      <li>Implemented preprocessing (VAD, normalization) for improved accuracy and reduced latency.</li>
                      <li>Extended modular pipeline for summarization, quiz generation, and LaTeX parsing.</li>
                      <li>Optimized inference with Rust extensions for memory efficiency and concurrency, using int8 (CPU) and fp16 (GPU) quantization.</li>
                    </ul>
                  </div>

                  <div className="info-block group relative p-5 -mx-5 rounded-2xl transition-all duration-500 hover:bg-white/[0.03] border border-transparent hover:border-white/10 mb-6">
                    <div className="info-header mb-3 text-white">
                      <h3 className="info-title text-xl font-bold transition-colors">AeroTrack Drone</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {"Raspberry Pi, YOLOv8, Computer Vision".split(', ').map((tech, i) => (
                          <span key={i} className="text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10 backdrop-blur-md transition-all hover:bg-white/10 whitespace-nowrap">{tech}</span>
                        ))}
                      </div>
                    </div>
                    <ul className="info-list">
                      <li>Built a custom drone integrating Raspberry Pi, camera module, and soldered hardware for autonomous vision-based tracking.</li>
                      <li>Implemented YOLOv8 model for real-time person detection and motion tracking.</li>
                      <li>Developed a Python control system enabling dynamic subject following, designed for third-person POV applications.</li>
                    </ul>
                  </div>

                  <div className="info-block group relative p-5 -mx-5 rounded-2xl transition-all duration-500 hover:bg-white/[0.03] border border-transparent hover:border-white/10 mb-6">
                    <div className="info-header mb-3 text-white">
                      <h3 className="info-title text-xl font-bold transition-colors">FIRST Robotics Competition</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {"Java, C++, PlatformIO, ROS, Raspberry Pi, WPILib, SolidWorks, OnShape".split(', ').map((tech, i) => (
                          <span key={i} className="text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10 backdrop-blur-md transition-all hover:bg-white/10 whitespace-nowrap">{tech}</span>
                        ))}
                      </div>
                    </div>
                    <ul className="info-list">
                      <li>Programming Lead and CAD Subcommittee Lead; qualified for World Championships and placed Top 10 at Georgia State.</li>
                      <li>Developed robot subsystems and automation pipelines in Java and C++ using WPILib's Command-Based framework and PlatformIO for embedded development.</li>
                      <li>Integrated the ROS (Robot Operating System) framework for inter-process communication between vision, control, and localization nodes, enabling modular and distributed robotics software architecture.</li>
                      <li>Programmed microcontrollers for real-time motor control, sensor fusion, and PID-based automation with emphasis on low-latency reliability.</li>
                      <li>Implemented computer vision and autonomous decision-making on Raspberry Pi, integrating with drivetrain and targeting systems.</li>
                    </ul>
                  </div>

                  <div className="info-block">
                    <div className="info-header">
                      <h3 className="info-title">MediSync - Diamond Challenge Finalist</h3>
                      <span className="info-tech">AI, Inventory Management</span>
                    </div>
                    <ul className="info-list">
                      <li>Ranked in the top 8% globally in the Diamond Challenge Business Competition.</li>
                      <li>Developed an AI-driven medical inventory management platform using Python, Flask, and MongoDB for automated stock tracking and optimization.</li>
                    </ul>
                  </div>
                </div>

                {/* Technical Skills Section */}
                <div className="about-content-section">
                  <h2 className="content-section-title">Technical Skills</h2>
                  <div className="info-block">
                    <div className="skills-category">
                      <strong>Languages:</strong> Java, Python, JavaScript, TypeScript, C++, Rust, HTML/CSS, Node.js, React, SwiftUI (iOS), Express.js
                    </div>
                    <div className="skills-category">
                      <strong>Developer Tools:</strong> Xcode, IntelliJ, PyCharm, VSCode, Git, Docker, MongoDB, PostgreSQL, Redis, Tailwind CSS, Firebase, Fusion 360, OnShape, AWS (Lightsail), GitHub, GitLab, SolidWorks
                    </div>
                    <div className="skills-category">
                      <strong>APIs & Frameworks:</strong> Flask, OpenAI API, Faster-Whisper, CTranslate2
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </section>
      )}

      {/* Career Goals Section */}
      {loadingComplete && (
        <section id="career-goals" className="page-section content-section">
          <div className="section-content">
            <h2 className="section-title">Career Goals & Roadmap</h2>
            
            <div className="career-goals-container mt-8">
              <div className="primary-goal-card relative p-8 mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] group transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_rgba(99,102,241,0.15)] bg-slate-900/40 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 opacity-40 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-extrabold mb-5 bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent transform transition-all duration-500 group-hover:translate-x-1">Long-Term Aspirations</h3>
                  <p className="text-lg text-gray-300/90 leading-relaxed font-light">
                    My definitive long-term goal revolves around climbing the ladder in Big Tech while strategically transitioning my expertise. Next year, I am entirely focused on breaking into a competitive Software Engineering (SWE) role at an industry-leading tech company or a prominent, well-funded startup—targeting a highly competitive compensation structure to guarantee financial momentum early in my timeline. 
                  </p>
                  <p className="text-lg text-gray-300/90 leading-relaxed font-light mt-5">
                    Once my foot is firmly within the door and I have mastered the enterprise software engineering landscape, my roadmap dictates a calculated pivot toward specialized, hardware-oriented software engineering roles. This aligns deeply with my passion for computer engineering and embedded systems. Ultimately, in the longer horizon, I intend to transition away from purely technical implementation into highly impactful, non-technical leadership roles. Driving overarching product vision as a Product Manager will allow me to oversee the bleeding edge of multidisciplinary engineering, scale major technological decisions, and maximize my overall impact and compensation roadmap.
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                <span className="w-8 h-[2px] bg-indigo-500 rounded-full"></span>
                Strategic Timeline & Actionable Steps
              </h3>
              
              <div className="timeline-container relative pl-8 border-l-2 border-indigo-500/20 space-y-12 pb-8 ml-4">
                {/* Step 1 */}
                <div className="timeline-item relative group">
                  <div className="absolute w-5 h-5 bg-cyan-400 rounded-full -left-[43px] top-1 shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all duration-500 group-hover:scale-125 group-hover:shadow-[0_0_25px_rgba(34,211,238,1)] group-hover:bg-cyan-300"></div>
                  <div className="bg-slate-900/30 border border-white/5 p-6 rounded-2xl backdrop-blur-sm transition-all duration-500 group-hover:bg-white/[0.03] group-hover:border-white/10 group-hover:-translate-y-1 group-hover:shadow-lg">
                    <h4 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-400">1. Core SWE Domination (0-1 Years)</h4>
                    <p className="text-gray-400 mt-3 leading-relaxed">
                      Secure an elite SWE position at a tier-1 technology firm or hyper-growth startup next year. To achieve this, I am actively sharpening my distributed systems knowledge, heavily networking using my ePortfolio and active full-stack projects, and mastering high-level system design fundamentals.
                    </p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="timeline-item relative group">
                  <div className="absolute w-5 h-5 bg-blue-500 rounded-full -left-[43px] top-1 shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-500 group-hover:scale-125 group-hover:shadow-[0_0_25px_rgba(59,130,246,1)] group-hover:bg-blue-400"></div>
                  <div className="bg-slate-900/30 border border-white/5 p-6 rounded-2xl backdrop-blur-sm transition-all duration-500 group-hover:bg-white/[0.03] group-hover:border-white/10 group-hover:-translate-y-1 group-hover:shadow-lg">
                    <h4 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">2. Hardware-Software Integration Pivot (2-4 Years)</h4>
                    <p className="text-gray-400 mt-3 leading-relaxed">
                      Leverage my multidisciplinary B.S. in Computer Engineering from Georgia Tech to migrate internally or externally into embedded systems or specialized hardware-software integration teams. This includes actively taking advanced electronics coursework and seeking internal mobility routes once formally hired.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="timeline-item relative group">
                  <div className="absolute w-5 h-5 bg-purple-500 rounded-full -left-[43px] top-1 shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all duration-500 group-hover:scale-125 group-hover:shadow-[0_0_25px_rgba(168,85,247,1)] group-hover:bg-purple-400"></div>
                  <div className="bg-slate-900/30 border border-white/5 p-6 rounded-2xl backdrop-blur-sm transition-all duration-500 group-hover:bg-white/[0.03] group-hover:border-white/10 group-hover:-translate-y-1 group-hover:shadow-lg">
                    <h4 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-purple-400">3. Product Leadership Transition (5+ Years)</h4>
                    <p className="text-gray-400 mt-3 leading-relaxed">
                      Pivot toward the business-driven side of technology by transitioning into a dedicated Product Management (PM) trajectory. By capitalizing on my deep technical understanding of both software stacks and hardware architecture, I will effectively bridge the gap between engineering execution and overarching product strategy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Project Showcase Section */}
      {loadingComplete && (
        <section id="project-showcase" className="page-section content-section">
          <div className="section-content" style={{ maxWidth: '1200px' }}>
            <h2 className="section-title">Project Showcase</h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto -mt-4 mb-12 leading-relaxed">
              A curated collection of hands-on projects — click any card to dive into the full case study.
            </p>

            <div className="showcase-grid">
              {/* FEATURED — Discovery Project */}
              <a href="/discovery" className="showcase-card showcase-card-featured group">
                <div className="showcase-card-tag">
                  <span className="showcase-tag-dot" />
                  ECE 1100 · DISCOVERY PROJECT · FEATURED
                </div>
                <div className="showcase-card-body">
                  <div className="showcase-card-content">
                    <h3 className="showcase-card-title">
                      Time Token Planner <span className="showcase-card-plus">+</span> Focus Sensor
                    </h3>
                    <p className="showcase-card-desc">
                      A wearable + app concept that treats the 1,440 minutes of a day like a budget,
                      and uses physiological signals from a wrist sensor to detect when you&apos;re drifting off-task.
                      Walk through the pitch, the honest scope-down pivot, the live signal-processing demo,
                      and the interactive planner prototype.
                    </p>
                    <div className="showcase-card-tags">
                      <span className="showcase-mini-tag">DSP</span>
                      <span className="showcase-mini-tag">BLE</span>
                      <span className="showcase-mini-tag">Embedded</span>
                      <span className="showcase-mini-tag">React</span>
                      <span className="showcase-mini-tag">Canvas</span>
                    </div>
                    <span className="showcase-card-cta">
                      Open the dashboard
                      <span className="showcase-cta-arrow">→</span>
                    </span>
                  </div>

                  {/* Mini "scope" preview */}
                  <div className="showcase-card-visual">
                    <div className="showcase-scope">
                      <div className="showcase-scope-head">
                        <span className="showcase-scope-dot" />
                        <span className="showcase-scope-label">PPG · 50 Hz</span>
                        <span className="showcase-scope-bpm">72 BPM</span>
                      </div>
                      <svg viewBox="0 0 200 60" className="showcase-scope-trace" preserveAspectRatio="none">
                        <path
                          d="M0,30 Q5,30 8,15 T18,30 Q22,30 26,15 T36,30 Q40,30 44,15 T54,30 Q58,30 62,15 T72,30 Q76,30 80,15 T90,30 Q94,30 98,15 T108,30 Q112,30 116,15 T126,30 Q130,30 134,15 T144,30 Q148,30 152,15 T162,30 Q166,30 170,15 T180,30 Q184,30 188,15 T198,30"
                          fill="none"
                          stroke="#5eead4"
                          strokeWidth="1.4"
                        />
                      </svg>
                      <div className="showcase-scope-foot">
                        <span>● LIVE</span>
                        <span>DRIFT 0.32</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            <p className="text-gray-500 text-center text-sm mt-10">
              More projects available in the <button onClick={() => scrollToSection('about')} className="text-cyan-400 hover:text-cyan-300 transition-colors underline-offset-2 hover:underline">About Me</button> section.
            </p>
          </div>
        </section>
      )}

      {/* Resume Section */}
      {loadingComplete && (
        <section id="resume" className="page-section content-section">
          <div className="section-content">
            <h2 className="section-title">Resume</h2>
            <div className="resume-container group">
              {/* macOS style window buttons */}
              <div className="absolute top-4 left-5 flex gap-2 z-20">
                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-transform duration-300 hover:scale-110"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)] transition-transform duration-300 hover:scale-110"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-transform duration-300 hover:scale-110"></div>
              </div>
              <div className="absolute top-4 inset-x-0 mx-auto text-center pointer-events-none z-20">
                <span className="text-xs font-semibold text-gray-400 tracking-wider">resume.pdf</span>
              </div>
              <iframe 
                src="https://drive.google.com/file/d/1lB2u6K1f3o5IvdyWAFXVCZOQA5uAL39s/preview" 
                width="100%" 
                height="800px"
                style={{ border: 'none' }}
                title="Resume"
              />
              <div className="resume-link-container">
                <a 
                  href="https://drive.google.com/file/d/1lB2u6K1f3o5IvdyWAFXVCZOQA5uAL39s/view?usp=drive_link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resume-download-link"
                >
                  Open in Google Drive
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Projects Section - Hidden for now, might add back later if owner wants */}
      {/* {loadingComplete && (
        <section id="projects" className="page-section content-section">
          <div className="section-content">
            <h2 className="section-title">Projects</h2>
            <p className="section-text">Content coming soon...</p>
          </div>
        </section>
      )} */}

      {/* Skip Button (only during loading) */}
      {!loadingComplete && (
        <div className={`navigation-controls ${skipButtonOut ? 'slide-out' : ''}`}>
          <button 
            className="nav-button skip-button" 
            onClick={handleSkip}
          >
            Skip <span className="button-icon">⏭</span>
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <div className="toast-content">
            <svg className="toast-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span className="toast-message">{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}

