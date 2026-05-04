'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaShieldAlt, FaBell, FaDatabase, FaSave } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { changePasswordAction } from '@/actions/auth';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast.error('New passwords do not match');
    }
    setLoading(true);
    try {
      await changePasswordAction({
        oldPassword: passwords.old,
        newPassword: passwords.new
      });
      toast.success('Password changed successfully!');
      setPasswords({ old: '', new: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-8 ml-64">
      <div>
        <h1 className="text-3xl font-bold text-white">System Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile, security, and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <FaUserCircle size={32} className="text-primary" />
              <h3 className="text-xl font-bold text-white">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input defaultValue={user?.name || 'Mahfuj Alam'} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input defaultValue={user?.email || ''} disabled className="bg-white/5 border-white/10 opacity-50" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
              <FaShieldAlt size={32} className="text-green-400" />
              <h3 className="text-xl font-bold text-white">Security & Password</h3>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input 
                  type="password" 
                  value={passwords.old} 
                  onChange={e => setPasswords({...passwords, old: e.target.value})}
                  placeholder="••••••••" 
                  className="bg-white/5 border-white/10 text-white" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input 
                    type="password" 
                    value={passwords.new}
                    onChange={e => setPasswords({...passwords, new: e.target.value})}
                    placeholder="••••••••" 
                    className="bg-white/5 border-white/10 text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input 
                    type="password" 
                    value={passwords.confirm}
                    onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                    placeholder="••••••••" 
                    className="bg-white/5 border-white/10 text-white" 
                  />
                </div>
              </div>
              <div className="pt-4">
                <button 
                  disabled={loading}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass p-8 rounded-3xl space-y-6">
            <h3 className="font-bold text-white flex items-center gap-2">
              <FaBell className="text-yellow-400" /> Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-muted-foreground">Email alerts for new expenses</span>
                <button className="w-10 h-5 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
