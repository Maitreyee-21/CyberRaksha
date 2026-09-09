'use client';

import React, { useEffect, useState } from 'react';
import { X, User, Calendar, Phone, Mail, Check } from 'lucide-react';

export interface ProfileData {
  name: string;
  dateOfBirth: string;
  contactNumber: string;
  email: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode?: boolean;
}

const STORAGE_KEY = 'cyberraksha-profile';

export function ProfileModal({ isOpen, onClose, darkMode = true }: ProfileModalProps) {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    dateOfBirth: '',
    contactNumber: '',
    email: '',
  });
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Load from localStorage or fetch from auth endpoint
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
        return;
      }
    } catch {
      // Ignore storage error
    }

    // Fallback: try fetching current authenticated user
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setProfile((prev) => ({
            ...prev,
            name: data.user.fullName || '',
            email: data.user.email || '',
          }));
        }
      })
      .catch(() => {
        // Silent catch
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      window.dispatchEvent(new CustomEvent('cyberraksha-profile-updated', { detail: profile }));
      setSavedMessage(true);
      setTimeout(() => {
        setSavedMessage(false);
        onClose();
      }, 1000);
    } catch {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
        className={`relative z-10 w-full max-w-[480px] rounded-2xl border p-6 shadow-2xl transition-all ${
          darkMode
            ? 'border-white/[0.08] bg-[#0E141A] text-white'
            : 'border-slate-200 bg-white text-slate-900 shadow-slate-200/50'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00E6D0]/10 text-[#00E6D0]">
              <User size={20} />
            </div>
            <div>
              <h2 id="profile-title" className="text-lg font-bold">
                Your Profile
              </h2>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                All profile details are optional
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`rounded-lg p-2 transition ${
              darkMode
                ? 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Name Field */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Name <span className={`text-[10px] font-normal ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>(Optional)</span>
            </label>
            <div className="relative">
              <User size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your name"
                className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-sm outline-none transition ${
                  darkMode
                    ? 'border-white/[0.08] bg-[#141C24] text-white placeholder:text-slate-600 focus:border-[#00E6D0]/40'
                    : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-teal-500'
                }`}
              />
            </div>
          </div>

          {/* Date of Birth Field */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Date of Birth <span className={`text-[10px] font-normal ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>(Optional)</span>
            </label>
            <div className="relative">
              <Calendar size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-sm outline-none transition ${
                  darkMode
                    ? 'border-white/[0.08] bg-[#141C24] text-white placeholder:text-slate-600 focus:border-[#00E6D0]/40'
                    : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-teal-500'
                }`}
              />
            </div>
          </div>

          {/* Contact Number Field */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Contact Number <span className={`text-[10px] font-normal ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>(Optional)</span>
            </label>
            <div className="relative">
              <Phone size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="tel"
                value={profile.contactNumber}
                onChange={(e) => setProfile({ ...profile, contactNumber: e.target.value })}
                placeholder="+91 98765 43210"
                className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-sm outline-none transition ${
                  darkMode
                    ? 'border-white/[0.08] bg-[#141C24] text-white placeholder:text-slate-600 focus:border-[#00E6D0]/40'
                    : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-teal-500'
                }`}
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Email <span className={`text-[10px] font-normal ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>(Optional)</span>
            </label>
            <div className="relative">
              <Mail size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="name@example.com"
                className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-sm outline-none transition ${
                  darkMode
                    ? 'border-white/[0.08] bg-[#141C24] text-white placeholder:text-slate-600 focus:border-[#00E6D0]/40'
                    : 'border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-teal-500'
                }`}
              />
            </div>
          </div>

          {/* Feedback message */}
          {savedMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 text-xs font-semibold text-emerald-400">
              <Check size={14} />
              <span>Profile saved successfully!</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                darkMode
                  ? 'border border-white/10 bg-transparent text-slate-300 hover:bg-white/[0.06]'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#00E6D0] px-5 py-2.5 text-xs font-bold text-[#041311] shadow-[0_0_15px_rgba(0,230,208,0.3)] transition hover:brightness-110 active:scale-[0.98]"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
