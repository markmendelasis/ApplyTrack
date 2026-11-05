import React from 'react';
import { Menu, Plus } from 'lucide-react';
import { Button } from '../common/Button';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenNewApplication?: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenNewApplication,
  title,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {onOpenNewApplication && (
          <Button
            size="sm"
            onClick={onOpenNewApplication}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Application
          </Button>
        )}
      </div>
    </header>
  );
};
