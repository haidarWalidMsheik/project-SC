import { useEffect, useState } from 'react';
import ClinicMap from './components/ClinicMap';
import { CLINIC_LOCATION } from './config/clinic';

const clinicImage = (filename) => `${import.meta.env.BASE_URL}images/${filename}`;

const sitePages = ['home', 'services', 'find', 'contact', 'about'];

const services = [
  { title: 'Cleaning teeth', className: 'cleaning' }, { title: 'Veneers', className: 'veneers' }, { title: 'Bleaching / Whitening', className: 'whitening' },
  { title: 'Aligners', className: 'aligners' }, { title: 'Dental Implants', className: 'implants', description: 'Missing teeth? Check our advanced solutions for a permanent, natural-looking smile.' }, { title: 'Prosthodontics / Occlusodontics', className: 'prostho' },
];

const testimonials = [
  { id: 'nelly-abi-aoun', name: 'Nelly Abi aoun', rating: 5, text: 'The reviewer praised a warm welcome, compassionate care, and high-quality healthcare.' },
  { id: 'emile-dagher', name: 'Emile Dagher', rating: 5, text: 'The reviewer praised professional, quick service and being seen at the appointment time.' },
  { id: 'christelle-khraish', name: 'Christelle Khraish', rating: 2, text: 'The reviewer reported a long wait for an ultrasound appointment and incomplete blood testing.' },
];

// Reviews are intentionally text-only. This keeps visual/sexual remarks out of the public review cards.
const reviewExclusionPattern = /\b(?:photo|photos|picture|pictures|image|images|selfie|selfies|sexual|sex|sexy|nude|naked)\b|صورة|صور|فوتو|جنسي|جنسية|مثير|عاري/i;
const isDisplayableReview = ({ text }) => typeof text === 'string' && text.trim().length > 0 && !reviewExclusionPattern.test(text);

const locationImages = [
  { filename: 'clinic-reception.png', alt: 'Smiley Land clinic reception in Zouk Mosbeh', caption: 'Reception', position: 'center' },
  { filename: 'clinic-kids-room.png', alt: 'Smiley Land orthodontics and pediatric dentistry room', caption: 'Orthodontics & Pediatric Dentistry', position: 'center' },
  { filename: 'clinic-treatment-room.png', alt: 'Smiley Land general dentistry treatment room', caption: 'General Dentistry', position: 'center 54%' },
  { filename: 'clinic-endodontics.png', alt: 'Smiley Land endodontics treatment room', caption: 'Endodontics', position: 'center 56%' },
  { filename: 'clinic-lead-doctor-office.png', alt: 'Smiley Land lead doctor office', caption: 'Lead doctor office', position: 'center 58%' },
];

const doctors = [
  { name: 'Dr Gaelle Daou', role: 'Pediatric dentist', image: clinicImage('dr-gaelle-daou.jpg'), position: 'center 25%' },
  { name: 'Nour Bou Saleh', role: 'Orthodontist', image: clinicImage('dr-nour-bou-saleh.png'), position: 'center 27%' },
  { name: 'Dr Khalil Abi Khalil', role: 'Specialist in Oral Surgery & Implantology', image: clinicImage('dr-khalil-abi-khalil.png'), position: 'center 28%' },
  { name: 'Dr Simon Chidiac', role: 'Specialist in Aesthetic & Prosthetic Dentistry', image: clinicImage('dr-simon-chidiac.jpg'), position: 'center 15%' },
  { name: 'Dr Sara Chehab', role: 'Endodontist', image: clinicImage('dr-sara-chehab.png'), position: 'center 23%' },
];

function getCurrentPage() {
  const page = window.location.hash.replace('#/', '');
  return sitePages.includes(page) ? page : 'home';
}

function RouteLink({ page, children, className = '', onClick, ...props }) {
  return <a {...props} className={className} href={`#/${page}`} onClick={onClick}>{children}</a>;
}

function Logo({ footer = false }) {
  const filename = footer ? 'smiley-land-logo-transparent.png' : 'smiley-land-logo.png';
  return <RouteLink page="home" className={`logo-link${footer ? ' footer-logo-link' : ''}`} aria-label="Smiley Land home"><img src={clinicImage(filename)} alt="Smiley Land Cosmetic and Dental Clinic" /></RouteLink>;
}

function Header({ page }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const nav = [['home', 'Home'], ['about', 'About us'], ['services', 'Services'], ['find', 'Find us'], ['contact', 'Get in touch']];
  return <header className="site-header"><div className="nav-wrap"><Logo />
      <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></button>
      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        {nav.map(([navPage, label]) => <RouteLink key={navPage} page={navPage} onClick={closeMenu} className={page === navPage ? 'is-active' : ''}>{label}</RouteLink>)}
        <a href={`https://wa.me/${CLINIC_LOCATION.whatsapp}`} target="_blank" rel="noreferrer" onClick={closeMenu} className="appointment-nav">Book an appointment <span aria-hidden="true">⌕</span></a>
      </nav>
    </div></header>;
}

function ServicesGrid({ hideDecorativeMark = false }) {
  return <div className="services-grid">{services.map((service) => <article className={`service-tile ${service.className}`} key={service.title}>
    <div className="service-overlay"><span className="tooth-mark" aria-hidden="true" style={hideDecorativeMark ? { visibility: 'hidden' } : undefined}>♧</span><h3>{service.title}</h3>{service.description && <p>{service.description}</p>}</div>
  </article>)}</div>;
}

function Testimonials({ showGoogleReviewLink = false }) {
  const displayedTestimonials = testimonials.filter(isDisplayableReview).slice(0, 3);
  return <section className="testimonial-section"><div className="testimonial-heading">Google <b>Reviews</b></div><div className="testimonial-list">
    {displayedTestimonials.map((testimonial) => <article className={`testimonial-card${showGoogleReviewLink ? ' testimonial-card--review' : ''}`} key={testimonial.id}>
      {showGoogleReviewLink ? <a className="review-avatar" href={CLINIC_LOCATION.reviewLink} target="_blank" rel="noreferrer" aria-label={`Open ${testimonial.name}'s review on Google`}><img src={clinicImage('reviewer-avatar.png')} alt="" /></a> : <div className="lcd-badge"><span>LDC</span><small>LOUNGE DENTAL CLINIC</small></div>}
      {showGoogleReviewLink && <span className="review-source">Google review · {testimonial.rating} stars</span>}
      <h3>{testimonial.name}</h3><p className={showGoogleReviewLink ? 'review-excerpt' : ''}>{testimonial.text}</p>
      {showGoogleReviewLink && <a className="review-link" href={CLINIC_LOCATION.reviewLink} target="_blank" rel="noreferrer">Read on Google <span aria-hidden="true">↗</span></a>}
    </article>)}
  </div></section>;
}

function SiteFooter() {
  return <footer className="site-footer"><Logo footer /><div className="footer-menu"><RouteLink page="home">Home</RouteLink><RouteLink page="about">About us</RouteLink><RouteLink page="services">Services</RouteLink><RouteLink page="find">Find us</RouteLink><RouteLink page="contact">Get in touch</RouteLink></div><div className="footer-contact"><strong>GET IN<br />TOUCH</strong><span>☎ {CLINIC_LOCATION.phone}</span><span>✉ {CLINIC_LOCATION.email}</span><span>⌖ {CLINIC_LOCATION.address}</span></div></footer>;
}

function PageShell({ children, page }) {
  return <><Header page={page} /><main className={`page page-${page}`}>{children}</main><a className="whatsapp-button" href={`https://wa.me/${CLINIC_LOCATION.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Contact Smiley Land on WhatsApp">◔</a><SiteFooter /></>;
}

function HomePage() {
  return <PageShell page="home">
    <section className="home-hero"><div className="hero-photo-shape" /><div className="hero-message">WE GIVE YOU MORE REASONS TO SMILE.</div></section>
    <section className="clinic-intro block"><div><h1>SMILEY LAND CLINIC</h1><h2>A modern dental clinic offering complete care for every smile. Trusted treatments, advanced technology, and comfort in every visit.</h2><ul><li>Expert doctors, each highly specialized in their dental field, ensuring precise and dedicated care.</li><li>More than 25 years of experience delivering trusted treatments and consistent results.</li><li>Focus on fast recovery, comfort, and long-lasting dental health outcomes.</li><li>Use of advanced technology combined with premium-quality materials for reliable care.</li></ul></div><div className="clinic-visual"><span>SMILE<br />WITH<br />CONFIDENCE</span></div></section>
    <section className="what-we-do block"><h2>WHAT WE DO</h2><ServicesGrid /><RouteLink page="services" className="more-link">MORE <span>›</span></RouteLink></section>
    <section className="care-statement block"><h2>ADVANCED DENTAL CARE<br />AT ITS FINEST IN LEBANON</h2><p>From simple treatments to full smile transformations, we deliver dentistry built on precision, speed, and lasting quality. With expert specialists and modern technology, we make every visit efficient, comfortable, and focused on results you can trust.</p></section>
    <Testimonials showGoogleReviewLink />
  </PageShell>;
}

function ServicesPage() {
  return <PageShell page="services">
    <section className="service-page-hero"><div className="service-page-copy"><h1>Our goal is to provide you with<br /><b>an excellent dental experience</b></h1><p>While helping you achieve optimal dental health. We believe that prevention is better than cure and that minimally invasive dentistry and surgery is the basis for service in our practice.</p></div></section>
    <section className="what-we-do block services-page-grid"><h2>WHAT WE DO</h2><ServicesGrid hideDecorativeMark /></section>
    <section className="service-steps block"><span>01</span><div><h2>Precision you can feel.</h2><p>Every smile plan combines careful diagnostics, contemporary materials and a team that keeps your comfort at the centre of the process.</p></div><RouteLink page="contact" className="blue-cta">Book your consultation</RouteLink></section>
  </PageShell>;
}

function FindUsPage() {
  return <PageShell page="find">
    <section className="find-page"><div className="find-page-inner block"><aside className="location-panel"><div className="location-tabs"><span>Dubai</span><span>Antelias</span><b>Zouk Mosbeh</b></div><div className="location-details"><p><i>⌖</i><b>Smiley Land Cosmetic &amp; Dental Clinic</b><br />Elite Medical Center, Zouk Mosbeh</p><p><i>☎</i><a href={`tel:${CLINIC_LOCATION.phone.replace(/[^+\d]/g, '')}`}>{CLINIC_LOCATION.phone}</a></p><p><i>✉</i><a href={`mailto:${CLINIC_LOCATION.email}`}>{CLINIC_LOCATION.email}</a></p><p><i>▣</i>{CLINIC_LOCATION.hours.map((item) => <span key={item}>{item}<br /></span>)}</p></div></aside><ClinicMap /></div></section>
    <section className="location-images block"><h2>LOCATION IMAGES</h2><div className="location-image-grid">{locationImages.map((image) => <figure key={image.filename}><img src={clinicImage(image.filename)} alt={image.alt} style={{ objectPosition: image.position }} /><figcaption>{image.caption}</figcaption></figure>)}</div></section>
  </PageShell>;
}

function ContactPage() {
  return <PageShell page="contact">
    <section className="contact-page-intro"><div className="contact-copy"><p>VISIT US</p><h1>Care that starts<br />with a conversation.</h1><div className="contact-info"><h3>Smiley Land Cosmetic &amp; Dental Clinic</h3><p>Comprehensive Dental Care<br />Expert Team of Specialists<br />University Professors on Staff</p><a href={`tel:${CLINIC_LOCATION.phone.replace(/[^+\d]/g, '')}`}>Phone: {CLINIC_LOCATION.phone}</a><span>{CLINIC_LOCATION.address}</span></div></div><div className="appointment-photo"><div>BOOK AN APPOINTMENT</div></div></section>
    <Testimonials showGoogleReviewLink />
  </PageShell>;
}

function AboutPage() {
  return <PageShell page="about">
    <section className="about-hero"><div className="about-title"><p>Our Dental Service<br />we come from experience</p><small>In Numbers</small></div><div className="stats-row"><div><b>4.9/5</b><span>Google Reviews<br />Rating</span></div><div><b>11,000</b><span>Implants Placed<br />Since 1990</span></div><div><b>98.5%</b><span>Implant Success<br />Rate</span></div><div><b>3,000</b><span>Crowns Placed Per<br />Year</span></div></div></section>
    <section className="values-section block"><div><span className="value-icon">▣</span><h2>VALUES</h2><p>We believe in authenticity, collaboration, and meaningful growth. We stay true to each business's identity while unlocking its full potential.</p></div><div><span className="value-icon">◎</span><h2>MISSION</h2><p>To assess, consult, and transform businesses through clear, practical strategies. We guide our clients step by step.</p></div><div><span className="value-icon">◉</span><h2>VISION</h2><p>To create a limitless environment for innovation and sustainable growth, building long-term partnerships and stronger communities.</p></div></section>
    <section className="case-studies"><h2>CASE STUDIES</h2><div className="case-grid">{['one', 'two', 'three', 'four', 'five', 'six'].map((name) => <div className={`case-${name}`} key={name}><span>BEFORE</span><b>AFTER</b></div>)}</div></section>
    <section className="team-section"><div className="team-intro block"><div><h2>Meet our team</h2><div className="select-row"><button>Doctors and Dental Practitioners⌄</button><button>Country/Region⌄</button></div></div><p>We are a team of dentists with years of experience from some of the finest dental institutes around the world.<br /><RouteLink page="contact">— BOOK AN APPOINTMENT</RouteLink></p></div><div className="doctor-grid block">{doctors.map((doctor) => <article className="doctor-card" key={doctor.name}><img src={doctor.image} alt={doctor.name} style={{ objectPosition: doctor.position }} /><h3>{doctor.name}</h3><p>{doctor.role}</p></article>)}</div></section>
    <section className="best-section"><h2>What Makes Us The Best</h2><div><span>⌘<b>In-house Dental Lab<br />Access To</b></span><span>♧<b>90+ Doctors<br />Specialized</b></span><span>▦<b>Latest Technologies</b></span><span>▤<b>Customized Treatment Plans</b></span><span>▱<b>Transparent Cost</b></span><span>♢<b>13 Convenient Locations<br />Long-Lasting Results</b></span></div></section>
  </PageShell>;
}

function App() {
  const [page, setPage] = useState(getCurrentPage);
  useEffect(() => { const updatePage = () => { setPage(getCurrentPage()); window.scrollTo({ top: 0, behavior: 'smooth' }); }; window.addEventListener('hashchange', updatePage); return () => window.removeEventListener('hashchange', updatePage); }, []);
  if (page === 'services') return <ServicesPage />;
  if (page === 'find') return <FindUsPage />;
  if (page === 'contact') return <ContactPage />;
  if (page === 'about') return <AboutPage />;
  return <HomePage />;
}

export default App;
