import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

export const ViewToggle = ({ view, onChange }) => {
  return (
    <div className="flex items-center gap-1 bg-primary-100 dark:bg-slate-800 p-1 rounded-lg">
      <button
        onClick={() => onChange('table')}
        className={`view-toggle-btn ${view === 'table' ? 'active' : ''}`}
        title="Table view"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => onChange('card')}
        className={`view-toggle-btn ${view === 'card' ? 'active' : ''}`}
        title="Card view"
      >
        <LayoutGrid size={16} />
      </button>
    </div>
  );
};

export default ViewToggle;

