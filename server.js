const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Custom middleware to check working hours
const checkWorkingHours = (req, res, next) => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hour = now.getHours();
  
  // Check if it's Monday to Friday (1-5) and between 9 AM and 5 PM
  const isWorkingDay = day >= 1 && day <= 5;
  const isWorkingHour = hour >= 9 && hour < 17;
  
  if (isWorkingDay && isWorkingHour) {
    next(); // Continue to the route handler
  } else {
    // Send a custom page for outside working hours
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Outside Working Hours</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div class="container">
          <div class="outside-hours-message">
            <h1>🕐 We're Currently Closed</h1>
            <p>Our web application is only available during working hours:</p>
            <div class="working-hours">
              <strong>Monday to Friday</strong><br>
              <span>9:00 AM - 5:00 PM</span>
            </div>
            <p>Please visit us again during our operating hours. Thank you for your understanding!</p>
            <div class="current-time">
              Current time: ${now.toLocaleString()}
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  }
};

// Apply the working hours middleware to all routes
app.use(checkWorkingHours);

// Helper function to generate the navbar
const generateNavbar = (currentPage) => {
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Our Services', path: '/services' },
    { name: 'Contact Us', path: '/contact' }
  ];

  return pages.map(page => 
    `<a href="${page.path}" class="${currentPage === page.name ? 'active' : ''}">${page.name}</a>`
  ).join('');
};

// Helper function to generate the complete HTML page
const generatePage = (title, content, currentPage) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <nav class="navbar">
        <div class="nav-container">
          <div class="nav-logo">
            <h2>TechCorp</h2>
          </div>
          <div class="nav-links">
            ${generateNavbar(currentPage)}
          </div>
        </div>
      </nav>
      
      <main class="main-content">
        <div class="container">
          ${content}
        </div>
      </main>
      
      <footer class="footer">
        <div class="container">
          <p>&copy; 2025 TechCorp. All rights reserved. Available Monday-Friday, 9 AM - 5 PM.</p>
        </div>
      </footer>
    </body>
    </html>
  `;
};

// Routes
app.get('/', (req, res) => {
  const content = `
    <div class="hero-section">
      <h1>Welcome to TechCorp</h1>
      <p class="hero-subtitle">Your trusted partner in digital transformation</p>
      <div class="hero-description">
        <p>We are a leading technology company specializing in innovative solutions that drive business growth and success. Our team of experts is dedicated to delivering cutting-edge technology services that meet your unique needs.</p>
        <div class="features-grid">
          <div class="feature-card">
            <h3>🚀 Innovation</h3>
            <p>Cutting-edge solutions for modern challenges</p>
          </div>
          <div class="feature-card">
            <h3>🛡️ Reliability</h3>
            <p>Trusted services with 99.9% uptime</p>
          </div>
          <div class="feature-card">
            <h3>🎯 Excellence</h3>
            <p>Quality results that exceed expectations</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  res.send(generatePage('Home - TechCorp', content, 'Home'));
});

app.get('/services', (req, res) => {
  const content = `
    <div class="page-header">
      <h1>Our Services</h1>
      <p class="page-subtitle">Comprehensive technology solutions for your business</p>
    </div>
    
    <div class="services-grid">
      <div class="service-card">
        <div class="service-icon">💻</div>
        <h3>Web Development</h3>
        <p>Custom web applications built with modern technologies and best practices. From simple websites to complex enterprise solutions.</p>
        <ul class="service-features">
          <li>Responsive Design</li>
          <li>Performance Optimization</li>
          <li>SEO Implementation</li>
        </ul>
      </div>
      
      <div class="service-card">
        <div class="service-icon">📱</div>
        <h3>Mobile Apps</h3>
        <p>Native and cross-platform mobile applications that deliver exceptional user experiences across iOS and Android platforms.</p>
        <ul class="service-features">
          <li>iOS & Android Development</li>
          <li>Cross-platform Solutions</li>
          <li>App Store Optimization</li>
        </ul>
      </div>
      
      <div class="service-card">
        <div class="service-icon">☁️</div>
        <h3>Cloud Solutions</h3>
        <p>Scalable cloud infrastructure and migration services to help your business leverage the power of cloud computing.</p>
        <ul class="service-features">
          <li>Cloud Migration</li>
          <li>Infrastructure Management</li>
          <li>Security & Compliance</li>
        </ul>
      </div>
      
      <div class="service-card">
        <div class="service-icon">🔒</div>
        <h3>Cybersecurity</h3>
        <p>Comprehensive security solutions to protect your digital assets and ensure business continuity in an ever-evolving threat landscape.</p>
        <ul class="service-features">
          <li>Security Audits</li>
          <li>Threat Detection</li>
          <li>Compliance Management</li>
        </ul>
      </div>
    </div>
  `;
  
  res.send(generatePage('Our Services - TechCorp', content, 'Our Services'));
});

app.get('/contact', (req, res) => {
  const content = `
    <div class="page-header">
      <h1>Contact Us</h1>
      <p class="page-subtitle">Get in touch with our team of experts</p>
    </div>
    
    <div class="contact-content">
      <div class="contact-info">
        <div class="contact-card">
          <h3>📍 Office Location</h3>
          <p>123 Technology Street<br>
          Innovation District<br>
          Tech City, TC 12345</p>
        </div>
        
        <div class="contact-card">
          <h3>📞 Phone & Email</h3>
          <p>Phone: +1 (555) 123-4567<br>
          Email: info@techcorp.com<br>
          Support: support@techcorp.com</p>
        </div>
        
        <div class="contact-card">
          <h3>🕒 Business Hours</h3>
          <p>Monday - Friday<br>
          9:00 AM - 5:00 PM<br>
          Closed on weekends</p>
        </div>
      </div>
      
      <div class="contact-form-section">
        <h3>Send us a Message</h3>
        <form class="contact-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" name="subject" required>
          </div>
          
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          
          <button type="submit" class="submit-btn">Send Message</button>
        </form>
      </div>
    </div>
  `;
  
  res.send(generatePage('Contact Us - TechCorp', content, 'Contact Us'));
});

// 404 handler
app.use((req, res) => {
  const content = `
    <div class="error-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" class="btn">Go Home</a>
    </div>
  `;
  
  res.status(404).send(generatePage('Page Not Found - TechCorp', content, ''));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Application is available Monday-Friday, 9 AM - 5 PM');
});

module.exports = app;