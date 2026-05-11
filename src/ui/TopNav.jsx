import React, { useState, useRef, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, ChevronDown, Eye, ArrowLeft, Grid3x3, Link, Unlink, Plus, X, Undo2, Redo2, RefreshCw } from 'lucide-react';
import { BREAKPOINTS } from '../engine/responsiveUnits.js';
import { tokens, glassPanel } from './designTokens.js';

const BP_ICONS = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};

function StaggerItem({ index, baseDelay = 0, stagger = 40, children, style }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), baseDelay + index * stagger);
    return () => clearTimeout(t);
  }, [baseDelay, index, stagger]);
  return (
    <div style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-6px)',
      transition: 'opacity 300ms cubic-bezier(0.22,1,0.36,1), transform 300ms cubic-bezier(0.22,1,0.36,1)',
    }}>
      {children}
    </div>
  );
}

export function TopNav({
  breakpointId, onBreakpointChange,
  activeBreakpoints = ['desktop', 'mobile'],
  allBpMap,
  focusedBp, onExitFocus,
  elementCount,
  onTogglePreview,
  meshMode = true,
  onToggleMesh,
  showGridlines = false,
  onToggleGridlines,
  onAddCustomBreakpoint,
  onRemoveCustomBreakpoint,
}) {
  const [showBpPopover, setShowBpPopover] = useState(false);
  const [bpWidthInput, setBpWidthInput] = useState('1440');
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!showBpPopover) return;
    const handler = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) setShowBpPopover(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showBpPopover]);

  const bpMap = allBpMap || BREAKPOINTS;
  const currentBp = bpMap[focusedBp || breakpointId] || BREAKPOINTS.desktop;

  return (
    <div style={styles.root}>
      {/* Left: Logo, Site name, Design/Code */}
      <div style={styles.left}>
        <StaggerItem index={0} stagger={50} style={{ display: 'flex', alignItems: 'center' }}>
          {focusedBp ? (
            <button onClick={onExitFocus} style={styles.backBtn}>
              <ArrowLeft size={14} strokeWidth={2} />
              <span>Overview</span>
            </button>
          ) : (
            <button style={styles.logoBtn}>
              <div style={styles.logoBox}>
                <div style={styles.logoCircle} />
              </div>
              <ChevronDown size={11} color={tokens.text4} />
            </button>
          )}
        </StaggerItem>

        <StaggerItem index={1} stagger={50} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={styles.dividerV} />
          <button style={styles.siteNameBtn}>
            Studio 5462
            <ChevronDown size={11} color={tokens.text4} />
          </button>
        </StaggerItem>

        <StaggerItem index={2} stagger={50} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={styles.dividerV} />
          <button style={styles.pageBtn}>
            <span style={{ fontWeight: 500 }}>Design</span>
            <span style={{ color: tokens.text3, fontWeight: 400 }}>Code</span>
          </button>
        </StaggerItem>
      </div>

      {/* Center: Page, Breakpoints, Width, Mesh */}
      <div style={styles.center}>
        <StaggerItem index={0} baseDelay={120} stagger={60} style={{ display: 'flex', alignItems: 'center' }}>
          <button style={styles.pageSelectorBtn}>
            Home
            <ChevronDown size={11} color={tokens.text4} />
          </button>
        </StaggerItem>

        <StaggerItem index={1} baseDelay={120} stagger={60} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={styles.dividerV} />
          <div style={styles.bpSwitcher}>
            {activeBreakpoints.map((bpId) => {
              const isFocused = bpId === (focusedBp || breakpointId);
              const bpDef = bpMap[bpId] || BREAKPOINTS[bpId];
              if (!bpDef) return null;
              const Icon = BP_ICONS[bpId] || Monitor;
              const isCustom = bpDef.isCustom;
              return (
                <button
                  key={bpId}
                  onClick={() => onBreakpointChange(bpId)}
                  style={{
                    ...styles.bpBtn,
                    backgroundColor: isFocused ? tokens.activePill : 'transparent',
                    color: isFocused ? tokens.text1 : tokens.text3,
                  }}
                >
                  <Icon size={15} strokeWidth={isFocused ? 2 : 1.5} />
                  {isCustom && onRemoveCustomBreakpoint && (
                    <span
                      onClick={(e) => { e.stopPropagation(); onRemoveCustomBreakpoint(bpId); }}
                      style={styles.removeBpX}
                    >
                      <X size={9} strokeWidth={2} />
                    </span>
                  )}
                </button>
              );
            })}
            {onAddCustomBreakpoint && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowBpPopover((v) => !v)}
                  style={styles.addBpBtnSmall}
                  title="Add breakpoint"
                >
                  <Plus size={11} strokeWidth={2} />
                </button>
                {showBpPopover && (
                  <div ref={popoverRef} style={styles.bpPopover}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: tokens.text3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Add Breakpoint</span>
                    <input
                      type="number"
                      value={bpWidthInput}
                      onChange={(e) => setBpWidthInput(e.target.value)}
                      placeholder="Width (px)"
                      style={styles.bpPopoverInput}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const w = parseInt(bpWidthInput);
                          if (w > 0) { onAddCustomBreakpoint(w); setShowBpPopover(false); setBpWidthInput('1440'); }
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const w = parseInt(bpWidthInput);
                        if (w > 0) { onAddCustomBreakpoint(w); setShowBpPopover(false); setBpWidthInput('1440'); }
                      }}
                      style={styles.bpPopoverBtn}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </StaggerItem>

        <StaggerItem index={2} baseDelay={120} stagger={60} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={styles.widthBadge}>
            W {Math.round(currentBp.defaultWidth)} px
          </div>
        </StaggerItem>

        <StaggerItem index={3} baseDelay={120} stagger={60} style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <div style={styles.dividerV} />
          <div style={styles.meshSwitcher}>
            <button
              onClick={onToggleMesh}
              style={{
                ...styles.toolBtn,
                color: meshMode ? tokens.accent : tokens.text3,
              }}
              title={meshMode ? 'Mesh On' : 'Mesh Off'}
            >
              {meshMode ? <Link size={14} strokeWidth={2} /> : <Unlink size={14} strokeWidth={1.5} />}
            </button>
            <button
              onClick={onToggleGridlines}
              style={{
                ...styles.toolBtn,
                color: showGridlines ? tokens.accent : tokens.text3,
              }}
              title={showGridlines ? 'Hide Gridlines' : 'Show Gridlines'}
            >
              <Grid3x3 size={14} strokeWidth={showGridlines ? 2 : 1.5} />
            </button>
          </div>
        </StaggerItem>
      </div>

      {/* Right: Undo/Redo, Avatar, Preview, Publish */}
      <div style={styles.right}>
        <StaggerItem index={0} baseDelay={280} stagger={45} style={{ display: 'flex', alignItems: 'center' }}>
          <button style={styles.toolBtn} title="Undo"><Undo2 size={15} strokeWidth={1.5} color={tokens.text3} /></button>
        </StaggerItem>
        <StaggerItem index={1} baseDelay={280} stagger={45} style={{ display: 'flex', alignItems: 'center' }}>
          <button style={styles.toolBtn} title="Redo"><Redo2 size={15} strokeWidth={1.5} color={tokens.text3} /></button>
        </StaggerItem>
        <StaggerItem index={2} baseDelay={280} stagger={45} style={{ display: 'flex', alignItems: 'center' }}>
          <button style={styles.toolBtn} title="Refresh"><RefreshCw size={14} strokeWidth={1.5} color={tokens.text3} /></button>
        </StaggerItem>

        <StaggerItem index={3} baseDelay={280} stagger={45} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={styles.dividerV} />
          <div style={styles.avatar}><span>Y</span></div>
        </StaggerItem>

        <StaggerItem index={4} baseDelay={280} stagger={45} style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={onTogglePreview} style={styles.previewBtn} title="Preview">
            <Eye size={15} strokeWidth={1.5} />
          </button>
        </StaggerItem>

        <StaggerItem index={5} baseDelay={280} stagger={45} style={{ display: 'flex', alignItems: 'center' }}>
          <button style={styles.publishBtn}>Publish</button>
        </StaggerItem>
      </div>
    </div>
  );
}

const styles = {
  root: {
    height: 44,
    backgroundColor: '#212122',
    borderBottom: `1px solid #3C3C3D`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 10px',
    flexShrink: 0,
    fontFamily: tokens.fontUI,
  },
  left: { display: 'flex', alignItems: 'center', gap: 2 },
  center: { display: 'flex', alignItems: 'center', gap: 6 },
  right: { display: 'flex', alignItems: 'center', gap: 4 },

  dividerV: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    margin: '0 4px',
    flexShrink: 0,
  },

  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '5px 10px',
    borderRadius: tokens.radiusMd,
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.06)',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 500,
    color: tokens.text2,
  },
  logoBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '4px 6px',
    borderRadius: tokens.radiusMd,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  logoBox: {
    width: 22,
    height: 22,
    borderRadius: tokens.radiusSm,
    backgroundColor: '#f8f6f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: '#212122',
  },
  siteNameBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '4px 8px',
    borderRadius: tokens.radiusMd,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    color: '#f8f6f6',
    fontFamily: tokens.fontUI,
    whiteSpace: 'nowrap',
  },
  pageBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 10px',
    borderRadius: tokens.radiusMd,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: 12,
    color: '#f8f6f6',
    fontFamily: tokens.fontUI,
  },
  pageSelectorBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '4px 10px',
    borderRadius: tokens.radiusMd,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    color: '#f8f6f6',
    fontFamily: tokens.fontUI,
    whiteSpace: 'nowrap',
  },
  widthBadge: {
    fontSize: 11,
    fontWeight: 400,
    color: tokens.text3,
    fontFamily: 'monospace',
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
  },

  bpSwitcher: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#2F2F2F',
    borderRadius: tokens.radiusMd,
    padding: 2,
    gap: 1,
  },
  bpBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    padding: '5px 8px',
    borderRadius: tokens.radiusSm,
    border: 'none',
    cursor: 'pointer',
    fontSize: 11,
    transition: `all ${tokens.durFast} ${tokens.easeOut}`,
  },
  removeBpX: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 1,
    padding: 1,
    borderRadius: 2,
    cursor: 'pointer',
    opacity: 0.5,
  },
  addBpBtnSmall: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: tokens.radiusSm,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: tokens.text3,
  },
  bpPopover: {
    position: 'absolute',
    top: 32,
    right: 0,
    zIndex: 200,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: 10,
    borderRadius: tokens.radiusLg,
    ...glassPanel('opaque'),
    minWidth: 140,
  },
  bpPopoverInput: {
    padding: '5px 8px',
    borderRadius: tokens.radiusMd,
    border: `1px solid ${tokens.controlBorder}`,
    backgroundColor: tokens.inputBg,
    color: tokens.text1,
    fontSize: 12,
    fontFamily: 'monospace',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  bpPopoverBtn: {
    padding: '5px 10px',
    borderRadius: tokens.radiusMd,
    border: 'none',
    backgroundColor: tokens.accent,
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
  },

  meshSwitcher: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },
  toolBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: tokens.radiusMd,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    transition: `all ${tokens.durFast} ${tokens.easeOut}`,
  },

  avatar: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: '#C957FE',
    border: '1.5px solid #212328',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: 600,
  },
  previewBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: tokens.radiusMd,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: tokens.text4,
  },
  publishBtn: {
    padding: '6px 16px',
    borderRadius: tokens.radiusMd,
    border: 'none',
    backgroundColor: tokens.accent,
    cursor: 'pointer',
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 500,
    transition: `background-color ${tokens.durFast} ${tokens.easeOut}`,
  },
};
