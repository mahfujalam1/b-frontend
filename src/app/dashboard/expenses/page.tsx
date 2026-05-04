'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaEdit, FaSearch, FaFilter } from 'react-icons/fa';
import { getExpensesAction, deleteExpenseAction } from '@/actions/expense';
import { ExpenseModal } from '@/components/expenses/ExpenseModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchExpenses = async () => {
    try {
      const res = await getExpensesAction();
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to fetch expenses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
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
      fetchExpenses();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (expense: any) => {
    setEditData(expense);
    setIsModalOpen(true);
  };

  // Robust filtering: Title, Category, and Partner Name
  const filteredExpenses = expenses.filter(exp => {
    const searchStr = searchTerm.toLowerCase();
    return (
      exp.title.toLowerCase().includes(searchStr) ||
      exp.category.toLowerCase().includes(searchStr) ||
      (exp.addedBy?.name || '').toLowerCase().includes(searchStr)
    );
  });

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
          <h1 className="text-3xl font-bold text-white">Full Transaction Ledger</h1>
          <p className="text-muted-foreground mt-1">Detailed view of every business cost recorded.</p>
        </div>
        <button 
          onClick={() => { setEditData(null); setIsModalOpen(true); }}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          + Add New Expense
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search title, category or partner name..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 outline-none text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-all">
          <FaFilter /> Filter
        </button>
      </div>

      <div className="glass rounded-3xl overflow-hidden border-white/5 shadow-2xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white font-bold py-6">Date</TableHead>
              <TableHead className="text-white font-bold">Title</TableHead>
              <TableHead className="text-white font-bold">Category</TableHead>
              <TableHead className="text-white font-bold">Paid By</TableHead>
              <TableHead className="text-white font-bold text-right">Amount</TableHead>
              <TableHead className="text-white font-bold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense, i) => (
              <motion.tr 
                key={expense._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-white/5 hover:bg-white/5 transition-all group"
              >
                <TableCell className="text-muted-foreground font-medium">
                  {new Date(expense.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-white font-semibold">{expense.title}</p>
                    {expense.note && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{expense.note}</p>}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {expense.category}
                  </span>
                </TableCell>
                <TableCell className="text-white font-medium flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">
                    {(expense.addedBy?.name || 'U').charAt(0)}
                  </div>
                  {expense.addedBy?.name || 'Unknown'}
                </TableCell>
                <TableCell className="text-right text-red-400 font-bold">
                  ৳{expense.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-3">
                    <button onClick={() => handleEdit(expense)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all" title="Edit">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteClick(expense._id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all" title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
        
        {filteredExpenses.length === 0 && (
          <div className="p-20 text-center text-muted-foreground">
            No expenses found matching your search.
          </div>
        )}
      </div>

      <ExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchExpenses} 
        editData={editData}
      />

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense?"
        description="This action cannot be undone. All partners will be notified of this deletion via email."
      />
    </div>
  );
}
