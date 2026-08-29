'use client';

import * as React from 'react';
import { 
  Shield, Plus, History, Trash2, X, MessageSquare, 
  Image as ImageIcon, Link2, QrCode, ChevronLeft, ChevronRight, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScanHistoryItem } from '@/lib/types';
import { cn } from '@/lib/types';

interface SidebarProps {
  history: ScanHistoryItem[];
  currentId: string | null;
  onSelectScan: (item: ScanHistoryItem) => void;
  onNewScan: () => void;
  onDeleteScan: (id: string, e: React.MouseEvent) => void;
  onClearHistory: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  history,
  currentId,
  onSelectScan,
  onNewScan,
  onDeleteScan,
  onClearHistory,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon size={14} className="text-zinc-400 shrink-0" />;
      case 'url': return <Link2 size={14} className="text-zinc-400 shrink-0" />;
      case 'qr': return <QrCode size={14} className="text-zinc-400 shrink-0" />;
      default: return <MessageSquare size={14} className="text-zinc-400 shrink-0" />;
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'HIGH':
        return <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="High Risk" />;
      case 'MEDIUM':
        return <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Suspicious" />;
      default:
        return <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Low Risk" />;
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-zinc-950 border-r border-zinc-800/80 transition-all duration-200 md:static',
          collapsed ? 'w-0 md:w-16 overflow-hidden' : 'w-72',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Top App Header & New Scan */}
        <div className="p-3 border-b border-zinc-800/60 flex items-center justify-between gap-2">
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-1.5 py-1">
              <div className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Shield size={16} />
              </div>
              <div>
                <span className="font-semibold text-sm tracking-tight text-zinc-100">CyberRaksha</span>
                <span className="block text-[10px] text-zinc-400 -mt-0.5">Scam Intelligence</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            <button
              onClick={onCloseMobile}
              className="flex md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* New Scan Button */}
        <div className="p-3">
          <Button
            onClick={onNewScan}
            variant="default"
            size="sm"
            className={cn(
              'w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700/80 font-medium justify-start gap-2 shadow-xs transition',
              collapsed && 'px-0 justify-center'
            )}
            title="Start New Scan"
          >
            <Plus size={16} className="text-teal-400 shrink-0" />
            {!collapsed && <span>New Scan</span>}
          </Button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-1 space-y-0.5">
          {!collapsed && (
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
              <span>Recent Scans</span>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="hover:text-red-400 transition"
                  title="Clear scan history"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {history.length === 0 ? (
            !collapsed && (
              <div className="px-3 py-6 text-center text-xs text-zinc-400">
                No past scans yet. Start a new scan below.
              </div>
            )
          ) : (
            history.map((item) => {
              const isSelected = currentId === item.id;
              const dateStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              if (collapsed) {
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectScan(item)}
                    className={cn(
                      'w-full p-2.5 rounded-lg flex items-center justify-center hover:bg-zinc-900 transition my-0.5',
                      isSelected ? 'bg-zinc-900 text-teal-400 border border-zinc-800' : 'text-zinc-400'
                    )}
                    title={`${item.result.scam_category} (${item.result.risk_level})`}
                  >
                    {getRiskBadge(item.result.risk_level)}
                  </button>
                );
              }

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectScan(item)}
                  className={cn(
                    'group w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left text-xs cursor-pointer transition select-none',
                    isSelected 
                      ? 'bg-zinc-900 text-zinc-100 border border-zinc-800/90 font-medium' 
                      : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {getRiskBadge(item.result.risk_level)}
                    <div className="truncate">
                      <div className="truncate text-zinc-200">{item.result.scam_category}</div>
                      <div className="text-[10px] text-zinc-400 truncate mt-0.5">{item.snippet}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] text-zinc-400 group-hover:hidden">{dateStr}</span>
                    <button
                      onClick={(e) => onDeleteScan(item.id, e)}
                      className="hidden group-hover:flex p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition"
                      title="Delete this scan"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom subtle system info */}
        <div className="p-3 border-t border-zinc-800/60 text-[11px] text-zinc-400 bg-zinc-950/80">
          {!collapsed ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="flex items-center gap-1"><Info size={12} className="text-teal-400" /> IBM watsonx.ai</span>
                <span>Granite 4.1</span>
              </div>
              <div className="text-[10px] text-zinc-400">Multilingual: EN · HI · MR</div>
            </div>
          ) : (
            <div className="flex justify-center" title="IBM watsonx.ai · Granite 4.1">
              <Info size={14} className="text-zinc-400" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
