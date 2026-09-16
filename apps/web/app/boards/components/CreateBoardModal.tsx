"use client";

import React, { useState, useRef } from 'react';
import { boardApi } from '../../../lib/api';

interface CreateBoardModalProps {
  onClose: () => void;
  onBoardCreated: (boardId: string | number) => void;
}

const PRESET_GRADIENTS = [
  'from-purple-600 via-indigo-600 to-blue-700',
  'from-amber-600 via-orange-600 to-red-600',
  'from-emerald-600 via-teal-600 to-cyan-700',
  'from-zinc-800 via-zinc-900 to-black',
  'from-pink-600 via-rose-600 to-red-700'
];

const PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
];

export const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  onClose,
  onBoardCreated
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_GRADIENTS[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // File Upload Handler (PC / Mobile device files)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert any image format to base64 Data URL for instant rendering & persistence
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCustomImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      const created = await boardApi.createBoard({
        name: name.trim(),
        description: description.trim() || undefined,
        coverColor: selectedColor,
        coverImage: customImage || undefined
      });

      if (created) {
        onBoardCreated(created.id);
        onClose();
      }
    } catch (error) {
      console.error('Failed to create board:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-[#121214] text-white shadow-2xl">
        
        {/* Cover Preview Header */}
        <div
          className={`relative h-28 w-full ${
            customImage
              ? 'bg-cover bg-center'
              : `bg-gradient-to-r ${selectedColor}`
          } p-4 flex items-end justify-between transition-all duration-300`}
          style={customImage ? { backgroundImage: `url(${customImage})` } : undefined}
        >
          {customImage && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          )}

          <div className="relative z-10">
            <span className="text-xs font-bold text-white uppercase tracking-wider drop-shadow-md">
              Board Cover Preview
            </span>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Create new board</h2>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Board Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mobile App Redesign"
              required
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add board objective or notes..."
              rows={2}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-white focus:ring-1 focus:ring-white transition resize-none"
            />
          </div>

          {/* Background Selection Section */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Background Style
            </label>

            {/* Custom File Upload Button */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-zinc-900 px-4 py-2.5 text-xs font-medium text-zinc-200 hover:border-white hover:bg-zinc-800 transition"
                >
                  <span>📁</span>
                  <span>{customImage ? 'Change Uploaded Photo' : 'Upload from PC / Phone'}</span>
                </button>

                {customImage && (
                  <button
                    type="button"
                    onClick={() => setCustomImage(null)}
                    className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-xs text-red-400 hover:bg-zinc-800 transition"
                    title="Remove custom photo"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Presets Gradients */}
            <div>
              <span className="block text-[11px] text-zinc-500 mb-1.5 font-medium">
                Or pick a Color Gradient
              </span>
              <div className="flex items-center gap-2">
                {PRESET_GRADIENTS.map((gradient, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedColor(gradient);
                      setCustomImage(null);
                    }}
                    className={`h-8 flex-1 rounded-lg bg-gradient-to-r ${gradient} border transition-all ${
                      selectedColor === gradient && !customImage
                        ? 'border-white scale-105 ring-2 ring-white/30'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Presets Stock Photos */}
            <div>
              <span className="block text-[11px] text-zinc-500 mb-1.5 font-medium">
                Or pick a Wallpapers Stock Image
              </span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_PHOTOS.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomImage(photo)}
                    className={`h-12 w-full rounded-lg bg-cover bg-center border transition-all ${
                      customImage === photo
                        ? 'border-white scale-105 ring-2 ring-white/30'
                        : 'border-zinc-800 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundImage: `url(${photo})` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-xs font-bold text-black hover:bg-zinc-200 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;
