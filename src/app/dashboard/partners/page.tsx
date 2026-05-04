'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaArrowRight, FaHandHoldingUsd, FaBalanceScale, FaPlus, FaTrash } from 'react-icons/fa';
import { getPartnerStatsAction } from '@/actions/expense';
import { deleteUserAction } from '@/actions/user';
import { cn } from '@/lib/utils';
import { AddPartnerModal } from '@/components/partners/AddPartnerModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from 'sonner';

export default function PartnersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const fetchPartnerStats = async () => {
    try {
      const res = await getPartnerStatsAction();
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch partner stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerStats();
  }, []);

  const handleDeletePartner = async () => {
    if (!deleteId) return;
    try {
      await deleteUserAction(deleteId);
      toast.success('Partner removed from system');
      fetchPartnerStats();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete partner');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ml-64 text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 ml-64">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Partner Distributions</h1>
          <p className="text-muted-foreground mt-1">Automatic calculation of per-person costs and balances.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <FaPlus /> Add Partner
          </button>
        )}
      </div>

      <AddPartnerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchPartnerStats} 
      />

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeletePartner}
        title="Remove Partner?"
        description="This will permanently remove the partner from the system. Historical expense data associated with this user will remain for accounting purposes."
      />

      {/* Global Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-3xl flex items-center gap-6 border-primary/20">
          <div className="p-4 rounded-2xl bg-primary/10 text-primary">
            <FaBalanceScale size={32} />
          </div>
          <div>
            <p className="text-muted-foreground font-medium">Total Shared Cost</p>
            <h2 className="text-3xl font-bold text-white">৳ {data?.totalExpense?.toLocaleString()}</h2>
          </div>
        </div>
        <div className="glass p-8 rounded-3xl flex items-center gap-6 border-blue-500/20">
          <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400">
            <FaUsers size={32} />
          </div>
          <div>
            <p className="text-muted-foreground font-medium">Per Person Share</p>
            <h2 className="text-3xl font-bold text-white">৳ {data?.perPersonCost?.toFixed(2)}</h2>
          </div>
        </div>
      </div>

      {/* Partner List */}
      <div className="glass rounded-3xl overflow-hidden border-white/5">
        <div className="p-8 border-b border-white/5 bg-white/5">
          <h3 className="text-xl font-bold text-white">Member Status</h3>
        </div>
        <div className="divide-y divide-white/5">
          {data?.partnerDetails?.map((partner: any, i: number) => (
            <motion.div 
              key={partner.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {partner.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white group-hover:text-primary transition-all">{partner.name}</h4>
                  <p className="text-sm text-muted-foreground">{partner.email}</p>
                </div>
              </div>

              <div className="flex gap-12 items-center">
                <div className="text-center md:text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Total Paid</p>
                  <p className="text-xl font-bold text-white">৳ {partner.totalPaid.toLocaleString()}</p>
                </div>
                
                <div className="w-px h-10 bg-white/10 hidden md:block"></div>

                <div className="text-center md:text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Balance Status</p>
                  <p className={cn(
                    "text-xl font-bold flex items-center gap-2 justify-center md:justify-end",
                    partner.balance >= 0 ? "text-green-400" : "text-red-400"
                  )}>
                    {partner.balance >= 0 ? (
                      <>Receivable ৳ {partner.balance.toFixed(2)}</>
                    ) : (
                      <>Payable ৳ {Math.abs(partner.balance).toFixed(2)}</>
                    )}
                  </p>
                </div>

                {user?.role === 'admin' && user?.email !== partner.email && (
                  <button 
                    onClick={() => { setDeleteId(partner.userId); setIsConfirmOpen(true); }}
                    className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all ml-4"
                    title="Remove Partner"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Splitting logic explanation */}
      <div className="glass p-8 rounded-3xl bg-primary/5 border-primary/20">
        <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
          <FaHandHoldingUsd /> How it works:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-sm text-muted-foreground">
            <span className="font-bold text-white block mb-1">1. Sum All Costs</span>
            We calculate the total amount spent by all partners combined.
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-bold text-white block mb-1">2. Divide by Count</span>
            Total cost is divided by the number of partners to get the "Per Person Share".
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-bold text-white block mb-1">3. Calculate Balance</span>
            Individual total paid minus per-person share tells us if you receive or pay.
          </div>
        </div>
      </div>
    </div>
  );
}
