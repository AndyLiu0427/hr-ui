import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CardComponent } from 'ngx-hr-ui';
import { IconComponent } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';

interface SemanticToken {
  label: string;
  token: string;
  usage: string;
}

interface SemanticGroup {
  group: string;
  rows: SemanticToken[];
}

interface Shade {
  name: string;
  class: string;
  value: string;
}

interface Palette {
  name: string;
  note: string;
  shades: Shade[];
}

@Component({
  selector: 'oct-colors',
  templateUrl: './colors.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, IconComponent, TextComponent]
})
export class ColorsPageComponent {
  readonly copied = signal<string | null>(null);
  readonly announcement = signal<string>('');

  readonly semanticGroups = signal<SemanticGroup[]>([
    {
      group: 'Brand',
      rows: [{ label: 'Primary', token: '--primary', usage: 'Primary actions and key accents' }]
    },
    {
      group: 'Text',
      rows: [
        { label: 'Primary text', token: '--1', usage: 'Headings and body text' },
        { label: 'Secondary text', token: '--2', usage: 'Supporting and label text' },
        { label: 'Tertiary text', token: '--3', usage: 'Hints, captions, placeholders' }
      ]
    },
    {
      group: 'Surfaces',
      rows: [
        { label: 'Page background', token: '--primary-background', usage: 'App and page background' },
        { label: 'Surface background', token: '--secondary-background', usage: 'Cards and raised surfaces' }
      ]
    },
    {
      group: 'Lines',
      rows: [{ label: 'Border', token: '--border-color', usage: 'Borders and dividers' }]
    },
    {
      group: 'State',
      rows: [{ label: 'Disabled', token: '--disabled', usage: 'Disabled controls' }]
    },
    {
      group: 'Status',
      rows: [
        { label: 'Success', token: '--success', usage: 'Positive / success' },
        { label: 'Error', token: '--error', usage: 'Errors / destructive' },
        { label: 'Warning', token: '--warning', usage: 'Caution' },
        { label: 'Info', token: '--info', usage: 'Informational' }
      ]
    }
  ]);

  readonly palettes = signal<Palette[]>([
    {
      name: 'Basic',
      note: 'Pure white and black.',
      shades: [
        { name: 'white', class: 'bg-white', value: '#FFFFFF' },
        { name: 'black', class: 'bg-black', value: '#000000' }
      ]
    },
    {
      name: 'Background',
      note: 'Page and surface backgrounds (theme-aware).',
      shades: [
        { name: 'primary', class: 'bg-primary', value: 'var(--primary-background)' },
        { name: 'secondary', class: 'bg-secondary', value: 'var(--secondary-background)' }
      ]
    },
    {
      name: 'Neutral',
      note: 'Grayscale for text, borders, and surfaces.',
      shades: this.scale('neutral', [
        '#0A0A0A',
        '#171717',
        '#262626',
        '#404040',
        '#525252',
        '#737373',
        '#A3A3A3',
        '#D4D4D4',
        '#E5E5E5',
        '#F5F5F5',
        '#FAFAFA'
      ])
    },
    {
      name: 'Blue',
      note: 'Backs the Info status token.',
      shades: this.scale('blue', [
        '#172554',
        '#1e3a8a',
        '#1e40af',
        '#1d4ed8',
        '#2563eb',
        '#3b82f6',
        '#60a5fa',
        '#93c5fd',
        '#bfdbfe',
        '#dbeafe',
        '#eff6ff'
      ])
    },
    {
      name: 'Red',
      note: 'Backs the Error status token.',
      shades: this.scale('red', [
        '#450a0a',
        '#7f1d1d',
        '#991b1b',
        '#b91c1c',
        '#dc2626',
        '#ef4444',
        '#f87171',
        '#fca5a5',
        '#fecaca',
        '#fee2e2',
        '#fef2f2'
      ])
    },
    {
      name: 'Orange',
      note: 'Backs the Warning status token.',
      shades: this.scale('orange', [
        '#431407',
        '#7c2d12',
        '#9a3412',
        '#c2410c',
        '#ea580c',
        '#f97316',
        '#fb923c',
        '#fdba74',
        '#fed7aa',
        '#ffedd5',
        '#fff7ed'
      ])
    },
    {
      name: 'Yellow',
      note: 'Utility palette. The client color tag files EPD and EEB here.',
      shades: this.scale('yellow', [
        '#422006',
        '#713f12',
        '#854d0e',
        '#a16207',
        '#ca8a04',
        '#eab308',
        '#facc15',
        '#fde047',
        '#fef08a',
        '#fef9c3',
        '#fefce8'
      ])
    },
    {
      name: 'Green',
      note: 'Backs the Success status token.',
      shades: this.scale('green', [
        '#052e16',
        '#14532d',
        '#166534',
        '#15803d',
        '#16a34a',
        '#22c55e',
        '#4ade80',
        '#86efac',
        '#bbf7d0',
        '#dcfce7',
        '#f0fdf4'
      ])
    },
    {
      name: 'Cyan',
      note: 'Available utility palette.',
      shades: this.scale('cyan', [
        '#083344',
        '#164e63',
        '#155e75',
        '#0e7490',
        '#0891b2',
        '#06b6d4',
        '#22d3ee',
        '#67e8f9',
        '#a5f3fc',
        '#cffafe',
        '#ecfeff'
      ])
    },
    {
      name: 'Violet',
      note: 'Available utility palette.',
      shades: this.scale('violet', [
        '#1e1b4b',
        '#4c1d95',
        '#5b21b6',
        '#6d28d9',
        '#7c3aed',
        '#8b5cf6',
        '#a78bfa',
        '#c4b5fd',
        '#ddd6fe',
        '#ede9fe',
        '#f5f3ff'
      ])
    },
    {
      name: 'Pink',
      note: 'Available utility palette.',
      shades: this.scale('pink', [
        '#500724',
        '#831843',
        '#9d174d',
        '#be185d',
        '#db2777',
        '#ec4899',
        '#f472b6',
        '#f9a8d4',
        '#fbcfe8',
        '#fce7f3',
        '#fdf2f8'
      ])
    }
  ]);

  private scale(family: string, values: string[]): Shade[] {
    const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    return steps.map((step, i) => ({ name: step, class: `bg-hr-${family}-${step}`, value: values[i] }));
  }

  swatchFill(token: string): string {
    return `var(${token})`;
  }

  async copy(value: string): Promise<void> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = value;
        textArea.style.position = 'absolute';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } finally {
          document.body.removeChild(textArea);
        }
      }
      this.flash(value);
    } catch (err) {
      console.error('Failed to copy color token: ', err);
    }
  }

  private flash(value: string): void {
    this.copied.set(value);
    this.announcement.set(`Copied ${value}`);
    setTimeout(() => {
      this.copied.set(null);
      this.announcement.set('');
    }, 2000);
  }
}
