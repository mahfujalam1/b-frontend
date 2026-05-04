'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FaChartPie, 
  FaMoneyBillWave, 
  FaUsers, 
  FaCog, 
  FaSignOutAlt,
  FaCalculator
} from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { logoutAction } from '@/actions/auth';

const menuItems = [
  { name: 'Overview', icon: FaChartPie, href: '/dashboard' },
  { name: 'Expenses', icon: FaMoneyBillWave, href: '/dashboard/expenses' },
  { name: 'Partners', icon: FaUsers, href: '/dashboard/partners' },
  { name: 'Settings', icon: FaCog, href: '/dashboard/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const filteredMenuItems = menuItems.filter(item => {
    if (user?.role === 'admin') return true;
    // Partners can only see Overview and Expenses
    return ['Overview', 'Expenses', 'Partners'].includes(item.name);
  });

  // Note: user requested "partner jara thakbe sobai settings ar partner create korte parbe na"
  // So we hide Settings from partners.
  const displayItems = user?.role === 'admin' 
    ? menuItems 
    : menuItems.filter(item => item.name !== 'Settings');

  return (
    <div className="w-64 h-screen glass border-r-0 flex flex-col p-6 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="p-2 rounded-xl bg-primary/20 text-primary">
          <FaCalculator size={24} />
        </div>
        <span className="text-xl font-bold">Hisab Nikash Pro</span>
      </div>

      <nav className="flex-1 space-y-2">
        {displayItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group",
                isActive ? "text-white" : "text-muted-foreground hover:text-white"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon className={cn("relative z-10", isActive && "text-primary")} />
              <span className="relative z-10 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-white/5">
        <button 
          onClick={logoutAction}
          className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-red-400 transition-all w-full"
        >
          <FaSignOutAlt />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
