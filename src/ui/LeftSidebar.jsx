import React, { useState, useEffect } from 'react';
import { Layers, Crop, MoreHorizontal } from 'lucide-react';
import { tokens } from './designTokens.js';

function AddIcon({ active }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="2" y="2" width="24" height="24" rx="6" fill={active ? tokens.accent : '#323234'} stroke={active ? tokens.accent : '#4A4A4C'} strokeWidth="1" />
      <path d="M14 8.5V19.5M8.5 14H19.5" stroke={active ? '#fff' : '#E0E0E0'} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function LeftSidebar({ width, onToggleAddElements, addElementsOpen, onToggleLayers, layersOpen }) {
  return (
    <div style={{ ...styles.root, width }}>
      <div style={styles.topGroup}>
        <SidebarButton
          width={width}
          onClick={onToggleAddElements}
          title="Add Element"
          active={addElementsOpen}
          index={0}
        >
          <AddIcon active={addElementsOpen} />
        </SidebarButton>

        <SidebarButton width={width} title="Crop / Resize" index={1}>
          <Crop size={20} color='#C5C5C5' strokeWidth={1.5} />
        </SidebarButton>

        <SidebarButton
          width={width}
          onClick={onToggleLayers}
          title="Layers"
          active={layersOpen}
          index={2}
        >
          <Layers size={20} color={layersOpen ? tokens.accent : '#C5C5C5'} strokeWidth={1.5} />
        </SidebarButton>
      </div>

      <div style={styles.bottomGroup}>
        <SidebarButton width={width} title="More" index={3} baseDelay={200}>
          <MoreHorizontal size={20} color='#C5C5C5' strokeWidth={1.5} />
        </SidebarButton>
      </div>
    </div>
  );
}

function SidebarButton({ width, onClick, title, active, children, index = 0, baseDelay = 80 }) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), baseDelay + index * 60);
    return () => clearTimeout(t);
  }, [baseDelay, index]);

  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width,
        height: 44,
        border: 'none',
        backgroundColor: active
          ? 'rgba(60,103,255,0.12)'
          : hovered
            ? 'rgba(255,255,255,0.05)'
            : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 150ms ease, opacity 350ms cubic-bezier(0.22,1,0.36,1), transform 350ms cubic-bezier(0.22,1,0.36,1)',
        borderRadius: 0,
        position: 'relative',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-8px)',
      }}
    >
      {active && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 2,
          height: 20,
          backgroundColor: tokens.accent,
          borderRadius: '0 1px 1px 0',
          transition: 'height 200ms cubic-bezier(0.22,1,0.36,1)',
        }} />
      )}
      {children}
    </button>
  );
}

const styles = {
  root: {
    backgroundColor: '#212122',
    borderRight: `1px solid #3C3C3D`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '8px 0',
    flexShrink: 0,
  },
  topGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  bottomGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};
