import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2, Luggage } from 'lucide-react';
import { TravelGuide } from '../../types';

interface Props {
  guide: TravelGuide;
}

export const PackingChecklist: React.FC<Props> = ({ guide }) => {
  const initialCategories = guide.packing_checklist || [
    { category: 'Essentials', items: ['Passport / ID', 'Travel Insurance', 'Local Currency & Credit Cards'] },
    { category: 'Clothing', items: ['Comfortable Walking Shoes', 'Light Rain Jacket', 'Versatile Layers'] }
  ];

  const [categories, setCategories] = useState(initialCategories);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [newItemText, setNewItemText] = useState('');
  const [selectedCatIndex, setSelectedCatIndex] = useState(0);

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const updated = [...categories];
    updated[selectedCatIndex].items.push(newItemText.trim());
    setCategories(updated);
    setNewItemText('');
  };

  const removeItem = (catIdx: number, itemIdx: number) => {
    const updated = [...categories];
    updated[catIdx].items.splice(itemIdx, 1);
    setCategories(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Luggage className="w-4 h-4 text-indigo-400" />
            Personalized Packing Checklist
          </h3>
          <p className="text-xs text-slate-400 mt-1">Generated specifically for {guide.meta.destination} ({guide.meta.duration_days} days).</p>
        </div>
      </div>

      {/* Add Custom Item Input */}
      <form onSubmit={handleAddItem} className="flex gap-2">
        <select
          value={selectedCatIndex}
          onChange={(e) => setSelectedCatIndex(parseInt(e.target.value))}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200"
        >
          {categories.map((c, idx) => (
            <option key={idx} value={idx}>{c.category}</option>
          ))}
        </select>
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add custom packing item..."
          className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">{cat.category}</h4>
            <div className="space-y-2">
              {cat.items.map((item, itemIdx) => {
                const isChecked = !!checkedItems[item];
                return (
                  <div
                    key={itemIdx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 hover:bg-slate-950 transition-colors"
                  >
                    <div
                      onClick={() => toggleCheck(item)}
                      className="flex items-center space-x-2.5 cursor-pointer select-none"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                      <span className={`text-xs ${isChecked ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}`}>
                        {item}
                      </span>
                    </div>

                    <button
                      onClick={() => removeItem(catIdx, itemIdx)}
                      className="text-slate-600 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
