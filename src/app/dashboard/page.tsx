'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { FaArrowUp, FaWallet, FaChartLine, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { getStatsAction, getExpensesAction, deleteExpenseAction } from '@/actions/expense';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [statsRes, expensesRes] = await Promise.all([
        getStatsAction(),
        getExpensesAction('?limit=8')
      ]);
      setStats(statsRes.data);
      setExpenses(expensesRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteExpenseAction(deleteId);
      toast.success('Expense deleted and partners notified');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (expense: any) => {
    setEditData(expense);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ml-64 text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const chartData = stats?.monthlyStats?.map((s: any) => ({
    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][s._id - 1],
    amount: s.total
  })) || [];

  const COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-8 p-8 ml-64">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Financial Insights</h1>
          <p className="text-muted-foreground mt-1">Real-time analytics for your business partners.</p>
        </div>
        <button 
          onClick={() => { setEditData(null); setIsModalOpen(true); }}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <FaPlus /> Add Expense
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Business Cost', value: `৳ ${stats?.totalExpense?.toLocaleString() || 0}`, icon: FaWallet, color: 'text-primary', trend: '+12%', bgColor: 'bg-primary/10' },
          { label: 'Monthly Average', value: `৳ ${(stats?.totalExpense / 12).toFixed(0)}`, icon: FaChartLine, color: 'text-blue-400', trend: '-5%', bgColor: 'bg-blue-400/10' },
          { label: 'Top Spending Category', value: stats?.categoryStats?.[0]?._id || 'N/A', icon: FaArrowUp, color: 'text-green-400', trend: 'Peak', bgColor: 'bg-green-400/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2rem] card-hover relative overflow-hidden"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className={cn("p-4 rounded-2xl", stat.bgColor, stat.color)}>
                <stat.icon size={28} />
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 text-green-400 border border-green-400/20">
                {stat.trend}
              </span>
            </div>
            <div className="mt-6 relative z-10">
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-2 text-white">{stat.value}</h3>
            </div>
            {/* Subtle background decoration */}
            <div className={cn("absolute -right-8 -bottom-8 w-32 h-32 blur-3xl opacity-20", stat.bgColor)}></div>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-[2rem] h-[450px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Expenditure Trend</h3>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              <span className="text-xs text-muted-foreground">Monthly Flow</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={chartData.length > 0 ? chartData : [{ name: 'N/A', amount: 0 }]}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e1b4b', border: '1px solid #ffffff10', borderRadius: '16px', color: '#fff', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)' }}
                itemStyle={{ color: '#fff' }}
                cursor={{ stroke: '#7C3AED', strokeWidth: 2 }}
              />
              <Area type="monotone" dataKey="amount" stroke="#7C3AED" strokeWidth={4} fillOpacity={1} fill="url(#colorAmt)" animationDuration={2000} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass p-8 rounded-[2rem] h-[450px] flex flex-col">
          <h3 className="text-xl font-bold mb-6 text-white">Recent Ledger</h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {expenses.length > 0 ? expenses.map((expense, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex justify-between items-center p-5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {expense.category.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{expense.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-sm text-red-400">৳{expense.amount.toLocaleString()}</p>
                  <div className="hidden group-hover:flex gap-2">
                    <button onClick={() => handleEdit(expense)} className="text-blue-400 hover:text-blue-300 transition-all"><FaEdit /></button>
                    <button onClick={() => handleDeleteClick(expense._id)} className="text-red-400 hover:text-red-300 transition-all"><FaTrash /></button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                <FaWallet size={48} className="opacity-20" />
                <p>No records found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
        editData={editData}
      />

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Transaction?"
        description="Are you sure you want to delete this expense? All partners will receive a notification email about this removal."
      />
    </div>
  );
}
