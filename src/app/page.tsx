import Link from 'next/link';
import { FaCalculator, FaRocket, FaShieldAlt } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="inline-flex p-5 rounded-3xl bg-primary/10 text-primary mb-8 shadow-2xl shadow-primary/20 animate-bounce">
        <FaCalculator size={48} />
      </div>
      <h1 className="text-6xl font-extrabold tracking-tighter mb-4 bg-gradient-to-r from-primary-foreground via-primary to-primary/50 bg-clip-text text-transparent">
        Hisab Nikash Pro
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
        The most advanced cost tracking solution for modern businesses. 
        Collaborate with partners, visualize trends, and stay on top of your finances.
      </p>

      <div className="flex gap-6 mb-16">
        <Link 
          href="/login" 
          className="bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30"
        >
          Access Dashboard
        </Link>
        <button className="glass px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
          Learn More
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <div className="glass p-8 rounded-3xl text-left hover:border-primary/50 transition-all group">
          <FaRocket className="text-primary mb-4 group-hover:scale-110 transition-all" size={24} />
          <h3 className="font-bold text-lg mb-2">Real-time Stats</h3>
          <p className="text-sm text-muted-foreground">Instant calculations and data sync across all partner devices.</p>
        </div>
        <div className="glass p-8 rounded-3xl text-left hover:border-primary/50 transition-all group">
          <FaShieldAlt className="text-primary mb-4 group-hover:scale-110 transition-all" size={24} />
          <h3 className="font-bold text-lg mb-2">Secure Access</h3>
          <p className="text-sm text-muted-foreground">Role-based access control with robust JWT authentication.</p>
        </div>
        <div className="glass p-8 rounded-3xl text-left hover:border-primary/50 transition-all group">
          <FaCalculator className="text-primary mb-4 group-hover:scale-110 transition-all" size={24} />
          <h3 className="font-bold text-lg mb-2">Smart Charts</h3>
          <p className="text-sm text-muted-foreground">Beautiful monthly and yearly visualizations of your business costs.</p>
        </div>
      </div>
    </div>
  );
}
