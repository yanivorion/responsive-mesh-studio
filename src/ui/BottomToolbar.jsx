import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronDown, Monitor, Tablet, Columns, Pen, Link2, Smile, MoreHorizontal, Grid3x3, AlignCenter } from 'lucide-react';
import { tokens } from './designTokens.js';

function StaggerIcon({ index, baseDelay = 0, stagger = 35, children, style }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), baseDelay + index * stagger);
    return () => clearTimeout(t);
  }, [baseDelay, index, stagger]);
  return (
    <div style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(4px)',
      transition: 'opacity 280ms cubic-bezier(0.22,1,0.36,1), transform 350ms cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      {children}
    </div>
  );
}

export function BottomToolbar() {
  const [bgToggle, setBgToggle] = useState(false);
  const [barVisible, setBarVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      ...styles.root,
      opacity: barVisible ? 1 : 0,
      transform: barVisible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 400ms cubic-bezier(0.22,1,0.36,1), transform 400ms cubic-bezier(0.22,1,0.36,1)',
    }}>
      <div style={styles.section}>
        <StaggerIcon index={0} baseDelay={350} stagger={40}>
          <button style={styles.iconBtn} title="AI Magic">
            <Sparkles size={15} strokeWidth={1.5} color="#C5C5C5" />
          </button>
        </StaggerIcon>

        <StaggerIcon index={1} baseDelay={350} stagger={40}>
          <button style={styles.dropdownBtn}>
            <span style={{ fontSize: 12, color: '#E0E0E0', fontWeight: 400 }}>Custom Style</span>
            <ChevronDown size={11} color="#999" />
          </button>
        </StaggerIcon>

        <StaggerIcon index={2} baseDelay={350} stagger={40}>
          <button
            style={{
              ...styles.toggleBtn,
              backgroundColor: bgToggle ? tokens.accent : 'transparent',
              color: bgToggle ? '#fff' : '#C5C5C5',
            }}
            onClick={() => setBgToggle(v => !v)}
            title="Replace Background"
          >
            <HalfCircleIcon size={14} active={bgToggle} />
          </button>
        </StaggerIcon>
      </div>

      <StaggerIcon index={3} baseDelay={350} stagger={40} style={{ display: 'flex', alignItems: 'center' }}>
        <div style={styles.divider} />
      </StaggerIcon>

      <div style={styles.section}>
        {[
          { title: 'Grid', Icon: Grid3x3, i: 4 },
          { title: 'Align', Icon: AlignCenter, i: 5 },
          { title: 'Desktop', Icon: Monitor, i: 6 },
          { title: 'Tablet', Icon: Tablet, i: 7 },
          { title: 'Columns', Icon: Columns, i: 8 },
          { title: 'Pen', Icon: Pen, i: 9 },
          { title: 'Link', Icon: Link2, i: 10 },
          { title: 'Emoji', Icon: Smile, i: 11 },
          { title: 'More', Icon: MoreHorizontal, i: 12 },
        ].map(({ title, Icon, i }) => (
          <StaggerIcon key={title} index={i} baseDelay={350} stagger={35}>
            <button style={styles.iconBtn} title={title}>
              <Icon size={14} strokeWidth={1.5} color="#999" />
            </button>
          </StaggerIcon>
        ))}
      </div>
    </div>
  );
}

function HalfCircleIcon({ size = 14, active }) {
  const color = active ? '#fff' : '#C5C5C5';
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 2a6 6 0 1 1 0 12V2z" fill={color} opacity={0.7} />
      <circle cx="8" cy="8" r="5.5" stroke={color} strokeWidth="1.2" fill="none" />
    </svg>
  );
}

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    backgroundColor: '#2A2A2B',
    borderRadius: 8,
    border: '1px solid #3C3C3D',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    fontFamily: tokens.fontUI,
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    margin: '0 4px',
    flexShrink: 0,
  },
  iconBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 5,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'background-color 150ms ease',
  },
  dropdownBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '5px 10px',
    borderRadius: 5,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontFamily: tokens.fontUI,
    whiteSpace: 'nowrap',
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 5,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 200ms cubic-bezier(0.22,1,0.36,1)',
  },
};
