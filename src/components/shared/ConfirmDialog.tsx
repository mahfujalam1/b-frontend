'use client';

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { FaExclamationTriangle } from 'react-icons/fa';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, description }: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass border-white/10 sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-3 text-red-500 mb-2">
            <FaExclamationTriangle size={24} />
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className="px-6 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-lg shadow-red-500/20"
          >
            Confirm Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
