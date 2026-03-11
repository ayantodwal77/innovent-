import { useState, useEffect, useRef } from "react";

// ─── Palette & Tokens ────────────────────────────────────────────────────────
const T = {
  saffron: "#FF6B1A",
  saffronLight: "#FF8C42",
  saffronPale: "#FFF0E8",
  teal: "#0D7C73",
  tealLight: "#14A899",
  tealPale: "#E6F7F6",
  navy: "#0F2340",
  gold: "#D4A017",
  goldLight: "#F0C040",
  cream: "#FDF8F0",
  charcoal: "#2D2D2D",
  muted: "#6B7280",
  border: "#E8DDD0",
  white: "#FFFFFF",
};

// ─── Global Styles ────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; background: ${T.cream}; color: ${T.charcoal}; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${T.cream}; }
    ::-webkit-scrollbar-thumb { background: ${T.saffron}; border-radius: 3px; }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
    @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(255,107,26,0.3); } 50% { box-shadow: 0 0 40px rgba(255,107,26,0.6); } }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes bounceIn { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }

    .fade-up { animation: fadeUp 0.6s ease forwards; }
    .fade-in { animation: fadeIn 0.4s ease forwards; }
    .float { animation: float 3s ease-in-out infinite; }
    .glow { animation: glow 2s ease-in-out infinite; }

    .btn-primary {
      background: linear-gradient(135deg, ${T.saffron}, ${T.saffronLight});
      color: white; border: none; border-radius: 12px; padding: 12px 28px;
      font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px;
      cursor: pointer; transition: all 0.3s; display: inline-flex; align-items: center; gap: 8px;
      box-shadow: 0 4px 20px rgba(255,107,26,0.3);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,107,26,0.45); }
    .btn-primary:active { transform: translateY(0px); }

    .btn-teal {
      background: linear-gradient(135deg, ${T.teal}, ${T.tealLight});
      color: white; border: none; border-radius: 12px; padding: 12px 28px;
      font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px;
      cursor: pointer; transition: all 0.3s; display: inline-flex; align-items: center; gap: 8px;
      box-shadow: 0 4px 20px rgba(13,124,115,0.3);
    }
    .btn-teal:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(13,124,115,0.45); }

    .btn-outline {
      background: transparent; color: ${T.saffron};
      border: 2px solid ${T.saffron}; border-radius: 12px; padding: 10px 26px;
      font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px;
      cursor: pointer; transition: all 0.3s;
    }
    .btn-outline:hover { background: ${T.saffronPale}; transform: translateY(-1px); }

    .card {
      background: white; border-radius: 20px; padding: 28px;
      border: 1px solid ${T.border};
      box-shadow: 0 2px 20px rgba(0,0,0,0.06);
      transition: all 0.3s;
    }
    .card:hover { box-shadow: 0 8px 40px rgba(0,0,0,0.1); transform: translateY(-2px); }

    .input-field {
      width: 100%; padding: 14px 18px;
      border: 2px solid ${T.border}; border-radius: 12px;
      font-family: 'DM Sans', sans-serif; font-size: 15px; color: ${T.charcoal};
      background: white; transition: all 0.3s; outline: none;
    }
    .input-field:focus { border-color: ${T.saffron}; box-shadow: 0 0 0 4px rgba(255,107,26,0.1); }
    .input-field::placeholder { color: #B0A89A; }

    .select-field {
      width: 100%; padding: 14px 18px;
      border: 2px solid ${T.border}; border-radius: 12px;
      font-family: 'DM Sans', sans-serif; font-size: 15px; color: ${T.charcoal};
      background: white; outline: none; cursor: pointer; transition: all 0.3s;
      appearance: none;
    }
    .select-field:focus { border-color: ${T.saffron}; box-shadow: 0 0 0 4px rgba(255,107,26,0.1); }

    .textarea-field {
      width: 100%; padding: 14px 18px;
      border: 2px solid ${T.border}; border-radius: 12px;
      font-family: 'DM Sans', sans-serif; font-size: 15px; color: ${T.charcoal};
      background: white; outline: none; resize: vertical; min-height: 110px; transition: all 0.3s;
    }
    .textarea-field:focus { border-color: ${T.saffron}; box-shadow: 0 0 0 4px rgba(255,107,26,0.1); }

    .tag {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 500;
    }
    .tag-saffron { background: ${T.saffronPale}; color: ${T.saffron}; }
    .tag-teal { background: ${T.tealPale}; color: ${T.teal}; }
    .tag-gold { background: #FDF5E0; color: ${T.gold}; }
    .tag-navy { background: #EEF1F7; color: ${T.navy}; }

    .nav-item {
      padding: 10px 18px; border-radius: 10px; cursor: pointer;
      font-weight: 500; font-size: 15px; transition: all 0.2s; color: ${T.muted};
    }
    .nav-item:hover { background: ${T.saffronPale}; color: ${T.saffron}; }
    .nav-item.active { background: ${T.saffronPale}; color: ${T.saffron}; font-weight: 600; }

    .dot-pattern {
      background-image: radial-gradient(circle, rgba(255,107,26,0.12) 1.5px, transparent 1.5px);
      background-size: 24px 24px;
    }

    .ai-thinking { display: flex; gap: 6px; align-items: center; padding: 4px 0; }
    .ai-dot { width: 8px; height: 8px; border-radius: 50%; background: ${T.saffron}; animation: pulse 1.2s infinite; }
    .ai-dot:nth-child(2) { animation-delay: 0.2s; }
    .ai-dot:nth-child(3) { animation-delay: 0.4s; }

    .match-bar { height: 8px; border-radius: 4px; background: ${T.border}; overflow: hidden; }
    .match-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, ${T.teal}, ${T.tealLight}); transition: width 1.2s ease; }

    .notif-badge { position: absolute; top: -4px; right: -4px; width: 18px; height: 18px; background: ${T.saffron}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: white; }

    .hero-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; pointer-events: none; }

    .step-circle {
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(135deg, ${T.saffron}, ${T.gold});
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-weight: 700; color: white;
      box-shadow: 0 4px 16px rgba(255,107,26,0.3);
      flex-shrink: 0;
    }

    .profile-avatar {
      width: 64px; height: 64px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; font-weight: 700; color: white;
      flex-shrink: 0;
    }

    .glassmorphism {
      background: rgba(255,255,255,0.7);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.9);
    }

    .shimmer-text {
      background: linear-gradient(90deg, ${T.saffron}, ${T.gold}, ${T.saffron});
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 3s linear infinite;
    }

    .notification-toast {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      background: white; border-radius: 16px; padding: 18px 22px;
      box-shadow: 0 12px 48px rgba(0,0,0,0.15);
      border-left: 5px solid ${T.saffron};
      animation: slideIn 0.4s ease, fadeUp 0.4s ease;
      max-width: 360px;
    }

    .sidebar-link {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px; border-radius: 12px;
      cursor: pointer; font-weight: 500; color: ${T.muted};
      transition: all 0.2s; font-size: 15px;
    }
    .sidebar-link:hover, .sidebar-link.active {
      background: ${T.saffronPale}; color: ${T.saffron};
    }

    .switch {
      position: relative; width: 52px; height: 28px;
      background: ${T.border}; border-radius: 14px; cursor: pointer; transition: 0.3s;
    }
    .switch.on { background: ${T.saffron}; }
    .switch::after {
      content: ''; position: absolute; top: 4px; left: 4px;
      width: 20px; height: 20px; border-radius: 50%; background: white;
      transition: 0.3s; box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
    .switch.on::after { transform: translateX(24px); }

    .skill-chip {
      padding: 6px 16px; border-radius: 999px; font-size: 13px; font-weight: 500;
      background: ${T.tealPale}; color: ${T.teal}; cursor: pointer; transition: all 0.2s; border: 2px solid transparent;
    }
    .skill-chip:hover { border-color: ${T.teal}; }
    .skill-chip.selected { background: ${T.teal}; color: white; }

    .progress-step { display: flex; align-items: center; gap: 0; }
    .progress-dot { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; flex-shrink: 0; }
    .progress-line { flex: 1; height: 3px; }
  `}</style>
);

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_JOBS = [
  { id: 1, title: "Social Media Manager", business: "Sharma Electronics", type: "Part-time", location: "Delhi", pay: "₹8,000/mo", skills: ["Canva","Instagram","Content"], icon: "📱", color: "#FF6B1A", urgent: true },
  { id: 2, title: "Delivery Associate", business: "Gupta Grocery Store", type: "Gig", location: "Mumbai", pay: "₹500/day", skills: ["Driving","Communication"], icon: "🚴", color: "#0D7C73", urgent: false },
  { id: 3, title: "Junior Web Developer", business: "TechNova Pvt Ltd", type: "Full-time", location: "Bangalore", pay: "₹25,000/mo", skills: ["HTML","CSS","React"], icon: "💻", color: "#D4A017", urgent: true },
  { id: 4, title: "Store Assistant", business: "Patel Cloth House", type: "Gig", location: "Ahmedabad", pay: "₹300/day", skills: ["Customer Service","Hindi"], icon: "🛍️", color: "#9B59B6", urgent: false },
  { id: 5, title: "Data Entry Operator", business: "FinServe Solutions", type: "Freelance", location: "Remote", pay: "₹12,000/mo", skills: ["Excel","Typing","Accuracy"], icon: "📊", color: "#E74C3C", urgent: false },
  { id: 6, title: "Photography Assistant", business: "Riya Events Studio", type: "Freelance", location: "Chennai", pay: "₹1,500/shoot", skills: ["Photography","Editing","Lightroom"], icon: "📸", color: "#27AE60", urgent: true },
];

const MOCK_TALENT = [
  { id: 1, name: "Aryan Mehta", age: 20, location: "Delhi", skills: ["Social Media","Canva","Video Editing"], rating: 4.8, jobs: 5, avatar: "AM", color: "#FF6B1A", bio: "Creative content creator with experience in Instagram reels and short-form content.", available: true, score: 94 },
  { id: 2, name: "Priya Sharma", age: 22, location: "Mumbai", skills: ["Web Dev","React","Node.js"], rating: 4.9, jobs: 12, avatar: "PS", color: "#0D7C73", bio: "Full-stack developer building scalable web apps. Interned at 2 startups.", available: true, score: 97 },
  { id: 3, name: "Rohit Kumar", age: 19, location: "Bangalore", skills: ["Delivery","Customer Service","Maps"], rating: 4.6, jobs: 28, avatar: "RK", color: "#D4A017", bio: "Reliable and punctual. Completed 28 successful delivery gigs across Bangalore.", available: false, score: 81 },
  { id: 4, name: "Ananya Singh", age: 21, location: "Jaipur", skills: ["Data Entry","Excel","Typing"], rating: 4.7, jobs: 8, avatar: "AS", color: "#9B59B6", bio: "Fast typist with 95 WPM. Excel expert with data analysis skills.", available: true, score: 88 },
  { id: 5, name: "Dev Patel", age: 23, location: "Ahmedabad", skills: ["Photography","Editing","Videography"], rating: 4.9, jobs: 15, avatar: "DP", color: "#E74C3C", bio: "Award-winning student photographer. Specializes in event and product photography.", available: true, score: 96 },
];

const SKILLS_LIST = ["Social Media","Canva","Video Editing","Web Dev","React","Node.js","Python","Delivery","Customer Service","Data Entry","Excel","Photography","Videography","Content Writing","SEO","Graphic Design","Accounting","Teaching","Tailoring","Cooking","Driving"];

// ─── Components ───────────────────────────────────────────────────────────────

function Spinner() {
  return <div style={{ width: 24, height: 24, border: `3px solid rgba(255,107,26,0.2)`, borderTopColor: T.saffron, borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />;
}

function NotificationToast({ notif, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="notification-toast">
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ fontSize: 24 }}>{notif.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: T.charcoal, marginBottom: 4 }}>{notif.title}</div>
          <div style={{ fontSize: 13, color: T.muted }}>{notif.message}</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.muted, fontSize: 18, lineHeight: 1 }}>×</button>
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ setView, setRole }) {
  const [activeHero, setActiveHero] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveHero(p => (p + 1) % 3), 3000);
    return () => clearInterval(t);
  }, []);

  const heroes = [
    { text: "Hire for your shop", sub: "Post a gig in under 2 minutes", bg: T.saffron },
    { text: "Find your first job", sub: "Showcase skills, get hired fast", bg: T.teal },
    { text: "AI finds the match", sub: "Smart matching, zero hassle", bg: T.gold },
  ];

  const stats = [
    { n: "2.4L+", label: "Youth Registered", icon: "👩‍💼" },
    { n: "38K+", label: "Businesses", icon: "🏪" },
    { n: "92%", label: "Match Rate", icon: "🎯" },
    { n: "₹199", label: "Min. Hire Fee", icon: "💰" },
  ];

  const howItWorks = [
    { step: "1", title: "Post or Profile", desc: "Businesses post a role. Youth add skills and availability.", icon: "📝" },
    { step: "2", title: "AI Matches", desc: "Our AI reads the role and scores every talent profile.", icon: "🤖" },
    { step: "3", title: "Get Notified", desc: "Both sides get a friendly match notification.", icon: "🔔" },
    { step: "4", title: "Hire & Pay", desc: "Confirm the hire. Minimal fee. Everyone wins.", icon: "🤝" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ position: "relative", background: `linear-gradient(145deg, ${T.navy} 0%, #1A3A5C 100%)`, overflow: "hidden", minHeight: 600, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="hero-blob" style={{ width: 600, height: 600, background: T.saffron, top: -200, right: -200 }} />
        <div className="hero-blob" style={{ width: 400, height: 400, background: T.teal, bottom: -100, left: -100 }} />
        <div className="dot-pattern" style={{ position: "absolute", inset: 0, opacity: 0.3 }} />

        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "80px 32px 60px", display: "flex", gap: 60, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 400px" }}>
            <div className="tag tag-saffron" style={{ marginBottom: 20, animation: "fadeUp 0.5s ease" }}>🇮🇳 Made for Bharat</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,6vw,64px)", fontWeight: 900, color: "white", lineHeight: 1.15, marginBottom: 20, animation: "fadeUp 0.6s ease" }}>
              Where Small Dreams<br />
              <span className="shimmer-text">Meet Big Opportunities</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 18, lineHeight: 1.7, marginBottom: 36, maxWidth: 480, animation: "fadeUp 0.7s ease" }}>
              From the corner kirana store to growing startups — <strong style={{ color: "white" }}>Innovenv</strong> connects every business with talented youth using the power of AI.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", animation: "fadeUp 0.8s ease" }}>
              <button className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }} onClick={() => { setRole("business"); setView("dashboard"); }}>
                🏪 I'm a Business
              </button>
              <button className="btn-teal" style={{ fontSize: 16, padding: "14px 32px" }} onClick={() => { setRole("youth"); setView("dashboard"); }}>
                ✨ I'm Looking for Work
              </button>
            </div>
          </div>

          {/* Floating cards */}
          <div style={{ flex: "1 1 300px", position: "relative", minHeight: 360, display: "flex", justifyContent: "center", alignItems: "center" }}>
            {[
              { top: 0, left: "10%", delay: 0 },
              { top: "30%", left: "55%", delay: 0.5 },
              { top: "60%", left: "5%", delay: 1 },
            ].map((pos, i) => (
              <div key={i} className="card" style={{ position: "absolute", top: pos.top, left: pos.left, padding: "16px 20px", minWidth: 180, animation: `float ${3 + i}s ease-in-out infinite`, animationDelay: `${pos.delay}s`, opacity: i === activeHero ? 1 : 0.7, transform: i === activeHero ? "scale(1.05)" : "scale(1)", transition: "all 0.5s", zIndex: i === activeHero ? 2 : 1 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{["🏪","👨‍💻","🤖"][i]}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.charcoal }}>{heroes[i].text}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{heroes[i].sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ position: "relative", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 32px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: "white" }}>{s.n}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="tag tag-teal" style={{ marginBottom: 16 }}>Simple Process</span>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, fontWeight: 700, color: T.charcoal }}>Works in 4 Easy Steps</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 28 }}>
          {howItWorks.map((h, i) => (
            <div key={i} className="card" style={{ textAlign: "center", animation: `fadeUp ${0.4 + i * 0.15}s ease` }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{h.icon}</div>
              <div className="step-circle" style={{ margin: "0 auto 16px" }}>{h.step}</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 10, color: T.charcoal }}>{h.title}</h3>
              <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.7 }}>{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: `linear-gradient(135deg, ${T.saffron} 0%, ${T.gold} 100%)`, padding: "60px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div className="dot-pattern" style={{ position: "absolute", inset: 0 }} />
        <div style={{ position: "relative" }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, fontWeight: 700, color: "white", marginBottom: 12 }}>Ready to get started?</h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 17, marginBottom: 32 }}>Join thousands of businesses and youth already on Innovenv.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => { setRole("business"); setView("dashboard"); }} style={{ background: "white", color: T.saffron, border: "none", borderRadius: 12, padding: "14px 36px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: "0 8px 30px rgba(0,0,0,0.15)", transition: "all 0.3s" }}>Post a Job</button>
            <button onClick={() => { setRole("youth"); setView("dashboard"); }} style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "2px solid rgba(255,255,255,0.5)", borderRadius: 12, padding: "14px 36px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer", transition: "all 0.3s" }}>Find Opportunities</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── BUSINESS DASHBOARD ───────────────────────────────────────────────────────
function BusinessDashboard({ addNotif }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPostJob, setShowPostJob] = useState(false);
  const [jobForm, setJobForm] = useState({ title: "", type: "Full-time", location: "", pay: "", desc: "", skills: [] });
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [postedJobs, setPostedJobs] = useState(MOCK_JOBS.slice(0,3));

  const callAI = async () => {
    if (!jobForm.title || !jobForm.desc) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are an AI job matching assistant for Innovenv, an Indian platform connecting businesses with youth talent.

A business has posted this job:
- Title: ${jobForm.title}
- Type: ${jobForm.type}
- Location: ${jobForm.location}
- Pay: ${jobForm.pay}
- Description: ${jobForm.desc}
- Required Skills: ${selectedSkills.join(", ")}

Here are 5 registered youth profiles:
${MOCK_TALENT.map(t => `- ${t.name} (${t.age}y, ${t.location}): ${t.skills.join(", ")} | Rating: ${t.rating} | ${t.bio}`).join("\n")}

Respond ONLY in this JSON format (no markdown, no preamble):
{
  "topMatch": "name of top candidate",
  "matchScore": 94,
  "reason": "2-3 sentence explanation in simple, friendly English",
  "tips": ["tip1","tip2"],
  "suggestedPay": "₹X,XXX/mo or ₹XXX/day"
}`
          }]
        })
      });
      const data = await resp.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setAiResult(parsed);
      addNotif({ icon: "🎯", title: "AI Match Found!", message: `${parsed.topMatch} is your top match with ${parsed.matchScore}% compatibility!` });
    } catch (e) {
      setAiResult({ topMatch: "Priya Sharma", matchScore: 95, reason: "Priya has strong skills in web development and React, matching your requirements perfectly. She's worked with 2 startups before.", tips: ["Schedule an interview soon", "Check her portfolio"], suggestedPay: "₹20,000/mo" });
    }
    setAiLoading(false);
  };

  const postJob = () => {
    const newJob = { id: Date.now(), title: jobForm.title || "New Role", business: "Your Business", type: jobForm.type, location: jobForm.location || "Remote", pay: jobForm.pay || "Negotiable", skills: selectedSkills, icon: "💼", color: T.saffron, urgent: false };
    setPostedJobs(p => [newJob, ...p]);
    setShowPostJob(false);
    setJobForm({ title: "", type: "Full-time", location: "", pay: "", desc: "", skills: [] });
    setSelectedSkills([]);
    setAiResult(null);
    addNotif({ icon: "✅", title: "Job Posted!", message: "Your job is live. AI is now matching candidates." });
  };

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 72px)" }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: "white", borderRight: `1px solid ${T.border}`, padding: "28px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ padding: "0 8px 20px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Business Hub</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: T.charcoal }}>Sharma Electronics</div>
        </div>
        {[
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "jobs", label: "My Jobs", icon: "💼" },
          { id: "talent", label: "Browse Talent", icon: "👥" },
          { id: "matches", label: "AI Matches", icon: "🤖" },
          { id: "billing", label: "Billing", icon: "💳" },
        ].map(item => (
          <div key={item.id} className={`sidebar-link ${activeTab === item.id ? "active" : ""}`} onClick={() => setActiveTab(item.id)}>
            <span>{item.icon}</span> {item.label}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 12 }} onClick={() => setShowPostJob(true)}>
          + Post a Job
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "32px", overflowY: "auto", background: "#F9F6F2" }}>
        {activeTab === "overview" && (
          <div className="fade-in">
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Good morning! 👋</h2>
            <p style={{ color: T.muted, marginBottom: 28 }}>Here's what's happening with your hiring.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 20, marginBottom: 32 }}>
              {[
                { label: "Active Jobs", value: "3", icon: "💼", color: T.saffron },
                { label: "Total Applicants", value: "47", icon: "👥", color: T.teal },
                { label: "AI Matches", value: "12", icon: "🎯", color: T.gold },
                { label: "Hired This Month", value: "2", icon: "✅", color: "#27AE60" },
              ].map((s, i) => (
                <div key={i} className="card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Top AI Matches for Your Jobs</h3>
            <div style={{ display: "grid", gap: 16 }}>
              {MOCK_TALENT.slice(0,3).map((t, i) => (
                <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div className="profile-avatar" style={{ background: t.color }}>{t.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{t.name}</span>
                      {t.available && <span className="tag tag-teal" style={{ fontSize: 11, padding: "3px 10px" }}>Available</span>}
                    </div>
                    <div style={{ color: T.muted, fontSize: 13, marginBottom: 10 }}>{t.skills.join(" · ")}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="match-bar" style={{ flex: 1 }}><div className="match-fill" style={{ width: `${t.score}%` }} /></div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.teal }}>{t.score}%</span>
                    </div>
                  </div>
                  <button className="btn-outline" style={{ padding: "8px 18px", fontSize: 13 }}>View</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700 }}>My Job Posts</h2>
              <button className="btn-primary" onClick={() => setShowPostJob(true)}>+ Post New Job</button>
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              {postedJobs.map((j, i) => (
                <div key={i} className="card" style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: j.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{j.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 17 }}>{j.title}</span>
                      {j.urgent && <span className="tag tag-saffron" style={{ fontSize: 11 }}>Urgent</span>}
                      <span className="tag tag-teal" style={{ fontSize: 11 }}>{j.type}</span>
                    </div>
                    <div style={{ color: T.muted, fontSize: 13 }}>{j.business} · {j.location} · {j.pay}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      {j.skills.map((s, si) => <span key={si} className="tag tag-navy" style={{ fontSize: 11 }}>{s}</span>)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: 22, color: T.saffron }}>7</div>
                    <div style={{ fontSize: 12, color: T.muted }}>Applicants</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "talent" && (
          <div className="fade-in">
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Browse Talent</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
              {MOCK_TALENT.map((t, i) => (
                <div key={i} className="card">
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
                    <div className="profile-avatar" style={{ background: t.color, width: 52, height: 52, fontSize: 18 }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: T.muted }}>📍 {t.location} · ⭐ {t.rating}</div>
                    </div>
                    {t.available && <span className="tag tag-teal" style={{ marginLeft: "auto", fontSize: 11 }}>Open</span>}
                  </div>
                  <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 14 }}>{t.bio}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {t.skills.map((s, si) => <span key={si} className="tag tag-teal" style={{ fontSize: 11 }}>{s}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "9px 16px", fontSize: 13 }}>Invite</button>
                    <button className="btn-outline" style={{ flex: 1, justifyContent: "center", padding: "9px 16px", fontSize: 13 }}>Profile</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "matches" && (
          <div className="fade-in">
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>AI Matches</h2>
            <p style={{ color: T.muted, marginBottom: 24 }}>Our AI has analysed your job posts and found these top candidates.</p>
            <div style={{ background: `linear-gradient(135deg, ${T.navy}, #1A3A5C)`, borderRadius: 20, padding: 28, color: "white", marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 36 }}>🤖</div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700 }}>Innovenv AI Match Engine</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Analysing 5 candidates across 3 active jobs</div>
                </div>
              </div>
              <div className="match-bar" style={{ background: "rgba(255,255,255,0.15)" }}><div className="match-fill" style={{ width: "92%" }} /></div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>92% average match confidence</div>
            </div>
            {MOCK_TALENT.map((t, i) => (
              <div key={i} className="card" style={{ marginBottom: 16, display: "flex", gap: 20, alignItems: "center" }}>
                <div className="profile-avatar" style={{ background: t.color }}>{t.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: T.muted, marginBottom: 10 }}>{t.bio.slice(0,70)}...</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="match-bar" style={{ flex: 1 }}><div className="match-fill" style={{ width: `${t.score}%` }} /></div>
                    <span style={{ fontWeight: 700, fontSize: 15, color: T.teal, minWidth: 40 }}>{t.score}%</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button className="btn-primary" style={{ fontSize: 13, padding: "8px 16px" }} onClick={() => addNotif({ icon: "🎉", title: "Interview Scheduled!", message: `${t.name} has been invited for an interview.` })}>Hire</button>
                  <button className="btn-outline" style={{ fontSize: 13, padding: "7px 16px" }}>Skip</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "billing" && (
          <div className="fade-in">
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Billing & Plans</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 24 }}>
              {[
                { name: "Starter", price: "₹0", period: "Free", perks: ["Post 1 job", "5 AI matches", "Basic analytics"], highlight: false },
                { name: "Shop", price: "₹199", period: "per hire", perks: ["Unlimited posts", "AI matching", "Priority support", "WhatsApp alerts"], highlight: true },
                { name: "Enterprise", price: "₹999", period: "per month", perks: ["Everything in Shop", "Dedicated manager", "Custom integrations", "Bulk hiring"], highlight: false },
              ].map((p, i) => (
                <div key={i} className="card" style={{ border: p.highlight ? `2px solid ${T.saffron}` : undefined, position: "relative" }}>
                  {p.highlight && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: T.saffron, color: "white", padding: "4px 18px", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>Most Popular</div>}
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 900, color: p.highlight ? T.saffron : T.charcoal }}>{p.price}<span style={{ fontSize: 16, fontWeight: 400, color: T.muted }}> /{p.period}</span></div>
                  <div style={{ height: 1, background: T.border, margin: "20px 0" }} />
                  {p.perks.map((perk, pi) => <div key={pi} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, fontSize: 14, color: T.charcoal }}><span style={{ color: T.teal }}>✓</span>{perk}</div>)}
                  <button className={p.highlight ? "btn-primary" : "btn-outline"} style={{ width: "100%", justifyContent: "center", marginTop: 16 }}>Choose Plan</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Post Job Modal */}
      {showPostJob && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn 0.3s ease" }} onClick={e => e.target === e.currentTarget && setShowPostJob(false)}>
          <div style={{ background: "white", borderRadius: 24, padding: 36, maxWidth: 680, width: "100%", maxHeight: "90vh", overflowY: "auto", animation: "bounceIn 0.4s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700 }}>Post a Job 💼</h2>
              <button onClick={() => setShowPostJob(false)} style={{ background: T.border, border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 18 }}>×</button>
            </div>

            <div style={{ display: "grid", gap: 18 }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Job Title *</label>
                <input className="input-field" placeholder="e.g. Social Media Manager, Delivery Boy, Web Developer..." value={jobForm.title} onChange={e => setJobForm(f => ({...f, title: e.target.value}))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Job Type</label>
                  <select className="select-field" value={jobForm.type} onChange={e => setJobForm(f => ({...f, type: e.target.value}))}>
                    {["Full-time","Part-time","Gig","Freelance","Internship"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Location</label>
                  <input className="input-field" placeholder="City or Remote" value={jobForm.location} onChange={e => setJobForm(f => ({...f, location: e.target.value}))} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Pay / Compensation</label>
                <input className="input-field" placeholder="e.g. ₹10,000/mo or ₹500/day" value={jobForm.pay} onChange={e => setJobForm(f => ({...f, pay: e.target.value}))} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Job Description *</label>
                <textarea className="textarea-field" placeholder="Tell us what you need... Don't worry about perfect English — just explain your needs!" value={jobForm.desc} onChange={e => setJobForm(f => ({...f, desc: e.target.value}))} />
              </div>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Required Skills</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SKILLS_LIST.slice(0,16).map(s => (
                    <div key={s} className={`skill-chip ${selectedSkills.includes(s) ? "selected" : ""}`} onClick={() => setSelectedSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])}>{s}</div>
                  ))}
                </div>
              </div>

              {/* AI Section */}
              <div style={{ background: `linear-gradient(135deg, ${T.navy}08, ${T.tealPale})`, borderRadius: 16, padding: 20, border: `1px solid ${T.tealPale}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>🤖 AI Match Preview</div>
                    <div style={{ fontSize: 13, color: T.muted }}>Let AI find your best candidate before you even post!</div>
                  </div>
                  <button className="btn-teal" onClick={callAI} disabled={aiLoading} style={{ opacity: aiLoading ? 0.7 : 1 }}>
                    {aiLoading ? <Spinner /> : "✨ Match Now"}
                  </button>
                </div>
                {aiLoading && (
                  <div style={{ padding: "20px 0", textAlign: "center" }}>
                    <div className="ai-thinking" style={{ justifyContent: "center", marginBottom: 10 }}>
                      <div className="ai-dot" /><div className="ai-dot" /><div className="ai-dot" />
                    </div>
                    <div style={{ fontSize: 14, color: T.muted }}>AI is analysing 2,400+ profiles...</div>
                  </div>
                )}
                {aiResult && (
                  <div style={{ animation: "fadeUp 0.5s ease" }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "center", background: "white", borderRadius: 12, padding: 16, marginBottom: 14 }}>
                      <div style={{ fontSize: 32 }}>🏆</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{aiResult.topMatch} — Top Match!</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                          <div className="match-bar" style={{ flex: 1 }}><div className="match-fill" style={{ width: `${aiResult.matchScore}%` }} /></div>
                          <span style={{ fontWeight: 700, color: T.teal }}>{aiResult.matchScore}%</span>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: T.charcoal, lineHeight: 1.7, marginBottom: 12 }}>{aiResult.reason}</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {aiResult.tips?.map((tip, ti) => <span key={ti} className="tag tag-gold">💡 {tip}</span>)}
                    </div>
                    {aiResult.suggestedPay && <div style={{ marginTop: 12, padding: "10px 14px", background: T.saffronPale, borderRadius: 10, fontSize: 13, color: T.saffron, fontWeight: 600 }}>💰 AI Suggested Pay: {aiResult.suggestedPay}</div>}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button className="btn-outline" onClick={() => setShowPostJob(false)}>Cancel</button>
                <button className="btn-primary" onClick={postJob}>🚀 Post Job</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── YOUTH DASHBOARD ──────────────────────────────────────────────────────────
function YouthDashboard({ addNotif }) {
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedJob, setSelectedJob] = useState(null);
  const [aiCoverLetter, setAiCoverLetter] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [profileSkills, setProfileSkills] = useState(["Social Media","Canva","Video Editing"]);
  const [filterType, setFilterType] = useState("All");

  const generateCoverLetter = async (job) => {
    setAiLoading(true);
    setAiCoverLetter("");
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are an AI writing assistant on Innovenv, helping a young Indian job seeker apply for a position.

Job: ${job.title} at ${job.business} (${job.type}, ${job.location}, ${job.pay})
Required Skills: ${job.skills.join(", ")}

Candidate's Skills: ${profileSkills.join(", ")}

Write a SHORT, WARM, and NATURAL cover message (not formal) — as if a friendly young Indian person is writing it. Use simple English. Max 120 words. Do NOT include greetings or sign-off. Just the main body paragraph.`
          }]
        })
      });
      const data = await resp.json();
      setAiCoverLetter(data.content?.map(c => c.text || "").join("") || "I am excited about this opportunity and believe my skills align well with your requirements. I am a quick learner and hard worker.");
    } catch {
      setAiCoverLetter("I'm really excited about this opportunity! My experience with social media and content creation matches what you're looking for. I'm a fast learner, available immediately, and would love to contribute to your team. Looking forward to connecting!");
    }
    setAiLoading(false);
  };

  const applyJob = (job) => {
    if (!appliedJobs.find(j => j.id === job.id)) {
      setAppliedJobs(p => [job, ...p]);
      addNotif({ icon: "🎉", title: "Application Sent!", message: `You applied to ${job.title} at ${job.business}. Good luck!` });
    }
    setSelectedJob(null);
    setAiCoverLetter("");
  };

  const filteredJobs = filterType === "All" ? MOCK_JOBS : MOCK_JOBS.filter(j => j.type === filterType);

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 72px)" }}>
      <aside style={{ width: 240, background: "white", borderRight: `1px solid ${T.border}`, padding: "28px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ padding: "0 8px 20px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>My Space</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: T.charcoal }}>Aryan Mehta</div>
        </div>
        {[
          { id: "jobs", label: "Browse Jobs", icon: "🔍" },
          { id: "applications", label: "My Applications", icon: "📋" },
          { id: "profile", label: "My Profile", icon: "👤" },
          { id: "earnings", label: "Earnings", icon: "💰" },
        ].map(item => (
          <div key={item.id} className={`sidebar-link ${activeTab === item.id ? "active" : ""}`} onClick={() => setActiveTab(item.id)}>
            <span>{item.icon}</span> {item.label}
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ background: T.tealPale, borderRadius: 14, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>🌟</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.teal }}>Profile 78% complete</div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>Add more skills to get more matches!</div>
          <div className="match-bar" style={{ marginTop: 10 }}><div className="match-fill" style={{ width: "78%", background: `linear-gradient(90deg, ${T.teal}, ${T.tealLight})` }} /></div>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "32px", overflowY: "auto", background: "#F9F6F2" }}>
        {activeTab === "jobs" && (
          <div className="fade-in">
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Find Your Opportunity ✨</h2>
            <p style={{ color: T.muted, marginBottom: 20 }}>AI-matched jobs based on your skills.</p>

            <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
              {["All","Full-time","Part-time","Gig","Freelance"].map(t => (
                <button key={t} onClick={() => setFilterType(t)} style={{ padding: "8px 20px", borderRadius: 999, border: `2px solid ${filterType === t ? T.saffron : T.border}`, background: filterType === t ? T.saffronPale : "white", color: filterType === t ? T.saffron : T.charcoal, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, transition: "all 0.2s" }}>{t}</button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
              {filteredJobs.map((job, i) => (
                <div key={i} className="card" style={{ cursor: "pointer" }} onClick={() => { setSelectedJob(job); generateCoverLetter(job); }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: job.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{job.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 16 }}>{job.title}</span>
                        {job.urgent && <span className="tag tag-saffron" style={{ fontSize: 11 }}>🔥 Urgent</span>}
                      </div>
                      <div style={{ fontSize: 13, color: T.muted }}>{job.business}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 14, fontSize: 13, color: T.muted, flexWrap: "wrap" }}>
                    <span>📍 {job.location}</span>
                    <span>💼 {job.type}</span>
                    <span>💰 {job.pay}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {job.skills.map((s, si) => <span key={si} className="tag tag-navy" style={{ fontSize: 11 }}>{s}</span>)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: T.teal, fontWeight: 600 }}>🤖 AI Match: {Math.floor(70 + Math.random() * 28)}%</span>
                    {appliedJobs.find(j => j.id === job.id)
                      ? <span className="tag tag-teal" style={{ fontSize: 12 }}>✓ Applied</span>
                      : <button className="btn-primary" style={{ fontSize: 13, padding: "8px 18px" }} onClick={e => { e.stopPropagation(); setSelectedJob(job); generateCoverLetter(job); }}>Apply</button>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "applications" && (
          <div className="fade-in">
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, marginBottom: 24 }}>My Applications</h2>
            {appliedJobs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 24px" }}>
                <div style={{ fontSize: 60, marginBottom: 20 }}>🔍</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, marginBottom: 10 }}>No applications yet</h3>
                <p style={{ color: T.muted, marginBottom: 24 }}>Browse jobs and apply to get started!</p>
                <button className="btn-primary" onClick={() => setActiveTab("jobs")}>Browse Jobs</button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {appliedJobs.map((job, i) => (
                  <div key={i} className="card" style={{ display: "flex", gap: 20, alignItems: "center" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: job.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{job.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{job.title}</div>
                      <div style={{ fontSize: 13, color: T.muted }}>{job.business} · {job.location} · {job.pay}</div>
                    </div>
                    <span className="tag tag-gold">Under Review</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="fade-in">
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, marginBottom: 24 }}>My Profile</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div className="card">
                <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
                  <div className="profile-avatar" style={{ background: T.saffron, width: 72, height: 72, fontSize: 28 }}>AM</div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700 }}>Aryan Mehta</div>
                    <div style={{ color: T.muted, fontSize: 14 }}>📍 Delhi · 20 years old</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 6 }}><span className="tag tag-teal" style={{ fontSize: 11 }}>Available</span><span className="tag tag-saffron" style={{ fontSize: 11 }}>⭐ 4.8</span></div>
                  </div>
                </div>
                <div style={{ fontWeight: 600, marginBottom: 12 }}>My Skills</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SKILLS_LIST.slice(0,12).map(s => (
                    <div key={s} className={`skill-chip ${profileSkills.includes(s) ? "selected" : ""}`} onClick={() => setProfileSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])}>{s}</div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Profile Strength</div>
                {[
                  { label: "Skills Added", done: true },
                  { label: "Bio Written", done: true },
                  { label: "Photo Uploaded", done: false },
                  { label: "Phone Verified", done: true },
                  { label: "1st Job Applied", done: appliedJobs.length > 0 },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: item.done ? T.teal : T.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "white" }}>{item.done ? "✓" : "○"}</div>
                    <span style={{ fontSize: 14, color: item.done ? T.charcoal : T.muted }}>{item.label}</span>
                    {!item.done && <button className="btn-outline" style={{ padding: "4px 12px", fontSize: 12, marginLeft: "auto" }}>Add</button>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "earnings" && (
          <div className="fade-in">
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Earnings</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 20, marginBottom: 28 }}>
              {[
                { label: "Total Earned", value: "₹32,500", icon: "💰", color: T.gold },
                { label: "This Month", value: "₹8,000", icon: "📅", color: T.saffron },
                { label: "Gigs Done", value: "5", icon: "✅", color: T.teal },
                { label: "Avg Rating", value: "4.8 ⭐", icon: "🌟", color: "#9B59B6" },
              ].map((s, i) => (
                <div key={i} className="card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Recent Transactions</h3>
              {["Social Media Content - Sharma Electronics · ₹8,000", "Delivery Gig × 5 - Gupta Store · ₹2,500", "Website Design - TechNova · ₹15,000"].map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : undefined, fontSize: 14 }}>
                  <span>{t.split("·")[0]}</span>
                  <span style={{ fontWeight: 700, color: T.teal }}>+{t.split("·")[1]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Apply Modal */}
      {selectedJob && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={e => e.target === e.currentTarget && setSelectedJob(null)}>
          <div style={{ background: "white", borderRadius: 24, padding: 36, maxWidth: 600, width: "100%", maxHeight: "90vh", overflowY: "auto", animation: "bounceIn 0.4s ease" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: selectedJob.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{selectedJob.icon}</div>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700 }}>{selectedJob.title}</h2>
                <div style={{ color: T.muted, fontSize: 14 }}>{selectedJob.business} · {selectedJob.pay}</div>
              </div>
            </div>

            <div style={{ background: `linear-gradient(135deg, ${T.tealPale}, white)`, borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>🤖 AI-Generated Cover Letter</div>
              {aiLoading ? (
                <div style={{ padding: "16px 0", display: "flex", gap: 8, alignItems: "center" }}>
                  <div className="ai-dot" /><div className="ai-dot" /><div className="ai-dot" />
                  <span style={{ fontSize: 13, color: T.muted }}>Writing your cover letter...</span>
                </div>
              ) : (
                <p style={{ fontSize: 14, lineHeight: 1.8, color: T.charcoal }}>{aiCoverLetter}</p>
              )}
            </div>

            <div style={{ fontWeight: 700, marginBottom: 10 }}>Add a personal note (optional)</div>
            <textarea className="textarea-field" placeholder="Anything extra you'd like to add..." style={{ marginBottom: 20 }} />

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button className="btn-outline" onClick={() => setSelectedJob(null)}>Cancel</button>
              <button className="btn-teal" onClick={() => applyJob(selectedJob)}>🚀 Submit Application</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("landing");
  const [role, setRole] = useState(null);
  const [notifs, setNotifs] = useState([]);
  const [notifCount, setNotifCount] = useState(3);

  const addNotif = (n) => {
    const id = Date.now();
    setNotifs(p => [...p, { ...n, id }]);
    setNotifCount(c => c + 1);
  };

  const removeNotif = (id) => setNotifs(p => p.filter(n => n.id !== id));

  return (
    <>
      <GlobalStyle />
      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 500, background: "rgba(255,253,248,0.92)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.border}`, height: 72, display: "flex", alignItems: "center", padding: "0 32px", gap: 32 }}>
        <div onClick={() => setView("landing")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${T.saffron}, ${T.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🌟</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 800, color: T.charcoal }}>Innov<span style={{ color: T.saffron }}>env</span></span>
        </div>

        <div style={{ display: "flex", gap: 4, flex: 1, justifyContent: "center" }}>
          {view !== "landing" && (
            <>
              <div className={`nav-item`} onClick={() => setView("landing")}>Home</div>
              {role === "business" && <div className="nav-item active">Business Hub</div>}
              {role === "youth" && <div className="nav-item active">My Space</div>}
            </>
          )}
          {view === "landing" && (
            <>
              <div className="nav-item">How It Works</div>
              <div className="nav-item">Pricing</div>
              <div className="nav-item">About</div>
            </>
          )}
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => addNotif({ icon: "🎯", title: "New Match!", message: "Aryan Mehta is a 94% match for your Social Media Manager role." })}>
            <span style={{ fontSize: 22 }}>🔔</span>
            {notifCount > 0 && <div className="notif-badge">{notifCount > 9 ? "9+" : notifCount}</div>}
          </div>
          {view === "landing" ? (
            <>
              <button className="btn-outline" style={{ padding: "9px 22px", fontSize: 14 }} onClick={() => { setRole("business"); setView("dashboard"); }}>Login</button>
              <button className="btn-primary" style={{ padding: "9px 22px", fontSize: 14 }} onClick={() => { setRole("youth"); setView("dashboard"); }}>Sign Up Free</button>
            </>
          ) : (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div className="profile-avatar" style={{ background: role === "business" ? T.saffron : T.teal, width: 38, height: 38, fontSize: 15, borderRadius: "50%" }}>{role === "business" ? "SE" : "AM"}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{role === "business" ? "Sharma Electronics" : "Aryan Mehta"}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{role === "business" ? "Business Account" : "Youth Account"}</div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Role switcher */}
      {view !== "landing" && (
        <div style={{ background: "white", borderBottom: `1px solid ${T.border}`, padding: "10px 32px", display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>Switch View:</span>
          <button onClick={() => setRole("business")} style={{ padding: "6px 18px", borderRadius: 999, border: `2px solid ${role === "business" ? T.saffron : T.border}`, background: role === "business" ? T.saffronPale : "white", color: role === "business" ? T.saffron : T.muted, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12, transition: "all 0.2s" }}>🏪 Business</button>
          <button onClick={() => setRole("youth")} style={{ padding: "6px 18px", borderRadius: 999, border: `2px solid ${role === "youth" ? T.teal : T.border}`, background: role === "youth" ? T.tealPale : "white", color: role === "youth" ? T.teal : T.muted, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12, transition: "all 0.2s" }}>👩‍💼 Youth</button>
        </div>
      )}

      {/* Pages */}
      {view === "landing" && <LandingPage setView={setView} setRole={setRole} />}
      {view === "dashboard" && role === "business" && <BusinessDashboard addNotif={addNotif} />}
      {view === "dashboard" && role === "youth" && <YouthDashboard addNotif={addNotif} />}

      {/* Notification Toasts */}
      <div style={{ position: "fixed", bottom: 0, right: 0, zIndex: 9999, display: "flex", flexDirection: "column", gap: 12, padding: 24 }}>
        {notifs.map(n => <NotificationToast key={n.id} notif={n} onClose={() => removeNotif(n.id)} />)}
      </div>
    </>
  );
}
