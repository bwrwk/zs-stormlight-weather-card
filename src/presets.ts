import type { CardStyleConfig } from './types';

export const PRESET_STYLES = {
  urithiru_archive: {
    cardBackground: 'linear-gradient(180deg, rgba(19,33,44,0.98), rgba(8,14,22,0.99))',
    paper: 'linear-gradient(180deg, #dfe5e8 0%, #c6d0d6 52%, #aab6bf 100%)',
    ink: '#15212b',
    muted: 'rgba(21, 33, 43, 0.68)',
    accent: '#7fa9c3',
    accentSoft: 'rgba(127, 169, 195, 0.18)',
    border: '#7a9caf',
    alert: '#c76b4e',
    shadow: 'rgba(3, 8, 14, 0.34)',
  },
  stormfront_warning: {
    cardBackground: 'linear-gradient(180deg, rgba(15,22,35,0.99), rgba(5,9,18,1))',
    paper: 'linear-gradient(180deg, #cfd9e3 0%, #aebbc8 48%, #8191a1 100%)',
    ink: '#101a24',
    muted: 'rgba(16, 26, 36, 0.7)',
    accent: '#7fd6ff',
    accentSoft: 'rgba(127, 214, 255, 0.16)',
    border: '#62b9df',
    alert: '#f28968',
    shadow: 'rgba(2, 7, 12, 0.42)',
  },
  navani_notebook: {
    cardBackground: 'linear-gradient(180deg, rgba(37,39,48,0.98), rgba(17,20,28,1))',
    paper: 'linear-gradient(180deg, #f0e4cf 0%, #dcc8a8 52%, #c5ab82 100%)',
    ink: '#2f2416',
    muted: 'rgba(47, 36, 22, 0.66)',
    accent: '#c68d3c',
    accentSoft: 'rgba(198, 141, 60, 0.18)',
    border: '#b88338',
    alert: '#b3563f',
    shadow: 'rgba(18, 12, 5, 0.3)',
  },
} as const;

export function getDensityValues(density?: CardStyleConfig['density']) {
  if (density === 'compact') {
    return { cardPadding: '18px', heroPadding: '16px', gap: '14px' };
  }

  if (density === 'airy') {
    return { cardPadding: '28px', heroPadding: '24px', gap: '22px' };
  }

  return { cardPadding: '22px', heroPadding: '20px', gap: '18px' };
}
