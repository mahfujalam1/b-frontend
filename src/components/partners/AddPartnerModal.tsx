'use client';

import React from 'react';
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
import { toast } from 'sonner';
import axios from 'axios';

const partnerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

type PartnerForm = z.infer<typeof partnerSchema>;

interface AddPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPartnerModal({ isOpen, onClose, onSuccess }: AddPartnerModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PartnerForm>({
    resolver: zodResolver(partnerSchema),
  });

  const onSubmit: SubmitHandler<PartnerForm> = async (data) => {
    try {
      const response = await axios.post('https://hisab-nikash-server.vercel.app/api/v1/users/create-partner', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });

      if (response.data.success) {
        toast.success('Partner created and welcome email sent!');
        reset();
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create partner');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-white/10 sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Partner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Partner Name</Label>
            <Input {...register('name')} placeholder="e.g., John Doe" className="bg-white/5 border-white/10" />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input type="email" {...register('email')} placeholder="partner@company.com" className="bg-white/5 border-white/10" />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <p className="text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
            Note: An onboarding email with login credentials will be sent to this email address automatically.
          </p>

          <DialogFooter>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Partner Account'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
