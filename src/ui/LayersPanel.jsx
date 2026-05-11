import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ChevronRight, ChevronDown, X } from 'lucide-react';
import { tokens } from './designTokens.js';

export function LayersPanel({ open, onClose, elements, selectedElementId, selectedElementIds = new Set(), onSelectElement }) {
  const [mounted, setMounted] = useState(false);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    } else {
      setAnimIn(false);
      const t = setTimeout(() => setMounted(false), 280);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!mounted) return null;

  const stageElements = elements.filter((el) => el.location !== 'parkingLot');
  const parkedElements = elements.filter((el) => el.location === 'parkingLot');

  return (
    <div style={{
      ...styles.root,
      transform: animIn ? 'translateX(0)' : 'translateX(-12px)',
      opacity: animIn ? 1 : 0,
      transition: 'transform 280ms cubic-bezier(0.22,1,0.36,1), opacity 280ms cubic-bezier(0.22,1,0.36,1)',
    }}>
      <div style={styles.header}>
        <span style={styles.title}>Layers</span>
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={14} strokeWidth={2} color={tokens.text3} />
        </button>
      </div>

      <div style={styles.body}>
        {parkedElements.length > 0 && (
          <LayerGroup
            title="Out of Page"
            elements={parkedElements}
            selectedElementId={selectedElementId}
            selectedElementIds={selectedElementIds}
            onSelectElement={onSelectElement}
            isParked
          />
        )}

        <LayerGroup
          title="Page (Homepage)"
          elements={stageElements}
          selectedElementId={selectedElementId}
          selectedElementIds={selectedElementIds}
          onSelectElement={onSelectElement}
        />

        {elements.length === 0 && (
          <div style={styles.emptyState}>No elements</div>
        )}
      </div>
    </div>
  );
}

function LayerGroup({ title, elements, selectedElementId, selectedElementIds = new Set(), onSelectElement, isParked }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <button onClick={() => setCollapsed((v) => !v)} style={styles.groupHeader}>
        {collapsed
          ? <ChevronRight size={12} strokeWidth={2} color={tokens.text3} />
          : <ChevronDown size={12} strokeWidth={2} color={tokens.text3} />
        }
        <span style={{
          ...styles.groupTitle,
          color: isParked ? tokens.text3 : tokens.text1,
          fontStyle: isParked ? 'italic' : 'normal',
        }}>{title}</span>
        <span style={styles.groupCount}>{elements.length}</span>
      </button>
      {!collapsed && elements.map((el, idx) => {
        const isSel = selectedElementId === el.id || selectedElementIds.has(el.id);
        return (
        <button
          key={el.id}
          onClick={(e) => onSelectElement(el.id, e.shiftKey ? { shift: true } : undefined)}
          style={{
            ...styles.layerItem,
            backgroundColor: isSel ? tokens.accentSoft : 'transparent',
            color: isSel ? tokens.accent : tokens.text1,
          }}
        >
          <span style={styles.layerIcon}>{iconForType(el.componentId)}</span>
          <span style={styles.layerName}>{el.name}</span>
          {isParked && <span style={styles.parkedDot} />}
        </button>
        );
      })}
    </div>
  );
}

function iconForType(componentId) {
  const map = {
    image: '\u{1F5BC}', title: 'T', paragraph: '\u{00B6}', text: 'T',
    button: '\u{25A3}', container: '\u{25A1}', line: '\u{2500}',
    gallery: '\u{25A6}', menu: '\u{2630}', shape: '\u{25C6}',
    repeater: '\u{29C9}', video: '\u{25B6}', iframe: '\u{2395}',
  };
  return map[componentId] || '\u{25A1}';
}

const styles = {
  root: {
    position: 'absolute', left: 0, top: 0,
    width: 220, height: '100%',
    backgroundColor: tokens.glassStrong,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderRight: `1px solid ${tokens.border}`,
    display: 'flex', flexDirection: 'column',
    zIndex: 20, fontFamily: tokens.fontUI,
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 12px', borderBottom: `1px solid ${tokens.border}`,
  },
  title: { fontSize: 12, fontWeight: 600, color: tokens.text1 },
  closeBtn: {
    width: 24, height: 24, border: 'none', background: 'none',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: tokens.radiusSm,
  },
  body: { flex: 1, overflowY: 'auto', padding: '4px 0' },
  groupHeader: {
    width: '100%', display: 'flex', alignItems: 'center', gap: 4,
    padding: '6px 10px', border: 'none', background: 'none',
    cursor: 'pointer', fontSize: 11,
  },
  groupTitle: { fontWeight: 600, fontSize: 11 },
  groupCount: {
    marginLeft: 'auto', fontSize: 10, color: tokens.text3,
    backgroundColor: tokens.inputBg, padding: '1px 5px',
    borderRadius: tokens.radiusFull,
  },
  layerItem: {
    width: '100%', display: 'flex', alignItems: 'center', gap: 6,
    padding: '5px 10px 5px 26px',
    border: 'none', cursor: 'pointer', fontSize: 12,
    transition: `background-color ${tokens.durFast} ${tokens.easeOut}`,
    textAlign: 'left',
  },
  layerIcon: { fontSize: 11, opacity: 0.5, width: 16, textAlign: 'center', flexShrink: 0 },
  layerName: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  parkedDot: {
    width: 6, height: 6, borderRadius: '50%',
    backgroundColor: tokens.text3, opacity: 0.4, flexShrink: 0,
  },
  emptyState: {
    padding: 24, textAlign: 'center', fontSize: 12, color: tokens.text3,
  },
};
