import React from 'react';
import { motion } from 'motion/react';

interface ToolWrapperProps {
  title: string;
  description: string;
  seoText: string;
  children: React.ReactNode;
}

export const ToolWrapper: React.FC<ToolWrapperProps> = ({ title, description, seoText, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto p-6"
    >
      <header className="mb-8 relative">
        <div className="absolute top-0 right-0 flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-200">100% Free</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-200">Client-Side</span>
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-2 pr-40">{title}</h3>
        <p className="text-slate-600 text-lg">{description}</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        {children}
      </div>

      <footer className="prose prose-slate max-w-none border-t border-slate-200 pt-8">
        <p className="text-sm text-slate-500 italic">
          {seoText}
        </p>
      </footer>
    </motion.div>
  );
};
