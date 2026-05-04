'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { createExpenseAction, updateExpenseAction } from '@/actions/expense';

const expenseSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  amount: z.preprocess((val) => Number(val), z.number().min(1, 'Amount must be greater than 0')),
  category: z.string().min(1, 'Please select a category'),
  date: z.string(),
  note: z.string().optional(),
});

type ExpenseForm = z.infer<typeof expenseSchema>;

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: any;
}

export function ExpenseModal({ isOpen, onClose, onSuccess, editData }: ExpenseModalProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ExpenseForm>({
    resolver: zodResolver(expenseSchema) as any,
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    }
  });

  useEffect(() => {
    if (editData) {
      reset({
        title: editData.title,
        amount: editData.amount,
        category: editData.category,
        date: new Date(editData.date).toISOString().split('T')[0],
        note: editData.note || '',
      });
    } else {
      reset({
        title: '',
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
    }
  }, [editData, reset]);

  const onSubmit: SubmitHandler<ExpenseForm> = async (data) => {
    try {
      if (editData) {
        await updateExpenseAction(editData._id, data);
        toast.success('Expense updated successfully');
      } else {
        await createExpenseAction(data);
        toast.success('Expense added successfully');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-white/10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{editData ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input {...register('title')} placeholder="e.g., Office Rent" className="bg-white/5 border-white/10" />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount (৳)</Label>
              <Input type="number" {...register('amount')} placeholder="0.00" className="bg-white/5 border-white/10" />
              {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                {...register('category')}
                className="w-full h-8 px-3 rounded-md bg-white/5 border border-white/10 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="" disabled>Select</option>
                <option value="Food">Food</option>
                <option value="Rent">Rent</option>
                <option value="Utility">Utility</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" {...register('date')} className="bg-white/5 border-white/10" />
          </div>

          <div className="space-y-2">
            <Label>Note / Remarks</Label>
            <textarea
              {...register('note')}
              className="w-full min-h-[100px] p-3 rounded-md bg-white/5 border border-white/10 text-sm outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Add extra details here..."
            />
          </div>

          <DialogFooter>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editData ? 'Update Expense' : 'Save Expense'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
