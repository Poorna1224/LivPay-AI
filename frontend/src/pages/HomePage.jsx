import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-12">
          <section className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              AI-Powered Parametric Protection
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Protect gig workers from{" "}
              <span className="gradient-text">income loss</span>
            </h1>
            
            <p className="text-lg text-muted leading-8 mb-8 max-w-2xl mx-auto">
              LivPay AI helps delivery partners and gig workers stay financially
              safe when disruptions like heavy rain, pollution, heatwaves, and
              local restrictions stop them from earning.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary px-8 py-4 text-lg"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register Worker
                </span>
              </Link>
              <Link
                to="/worker-dashboard"
                className="btn-secondary px-8 py-4 text-lg"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Open Dashboard
                </span>
              </Link>
            </div>
          </section>

          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { label: "Active Workers", value: "2,500+", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", gradient: "from-blue-500 to-indigo-500" },
              { label: "Claims Processed", value: "1,200+", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", gradient: "from-emerald-500 to-teal-500" },
              { label: "Total Payouts", value: "₹8.5L+", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", gradient: "from-amber-500 to-orange-500" },
              { label: "Cities Covered", value: "12+", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", gradient: "from-violet-500 to-purple-500" },
            ].map((stat, i) => (
              <div key={i} className="card-dark p-5 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </section>

          <section className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              { 
                title: "Weekly Protection", 
                desc: "Affordable weekly plans designed for gig worker payout cycles.",
                icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                gradient: "from-blue-500 to-cyan-500"
              },
              { 
                title: "Automatic Triggers", 
                desc: "Rain, AQI, heatwave and disruption-based protection logic.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
                gradient: "from-violet-500 to-purple-500"
              },
              { 
                title: "Zero-Touch Claims", 
                desc: "Claims are generated from triggers without long manual forms.",
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                gradient: "from-emerald-500 to-teal-500"
              },
              { 
                title: "Fraud Detection", 
                desc: "AI-based fraud scoring protects the platform from misuse.",
                icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                gradient: "from-rose-500 to-pink-500"
              },
            ].map((feat, i) => (
              <div key={i} className="card-dark p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={feat.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">{feat.title}</h3>
                <p className="mt-2 text-muted text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </section>

          <section className="card-dark p-8 md:p-12 mb-16">
            <div className="text-center mb-10">
              <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Process</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">How LivPay AI Works</h2>
            </div>

            <div className="grid md:grid-cols-5 gap-6">
              {[
                { step: "Worker registers", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                { step: "AI calculates premium", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
                { step: "Policy is created", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                { step: "Trigger gets detected", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
                { step: "Claim & payout follow", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                    </div>
                    {index < 4 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-indigo-500/30 to-transparent -translate-x-8"></div>
                    )}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="font-medium text-white text-sm">{item.step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center py-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to protect your income?</h2>
            <p className="text-muted text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of gig workers who trust LivPay AI for their income protection.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary px-8 py-4 text-lg"
              >
                Get Started Free
              </Link>
              <Link
                to="/admin-dashboard"
                className="btn-secondary px-8 py-4 text-lg"
              >
                View Admin Demo
              </Link>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-6 text-center text-muted">
            <p>&copy; 2026 LivPay AI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;
