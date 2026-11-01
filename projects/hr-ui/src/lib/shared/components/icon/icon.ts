import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { LucideAngularModule, icons } from 'lucide-angular';
import { HrIconComponent, type IconDefinition, Client, Invoice, Onboarding, PayRun, Payslip, Team, Timesheet } from 'hr-icons/angular';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconColor = 'error' | 'success' | 'disabled' | 'primary' | 'neutral';

/**
 * The hr-icons marks this app uses, addressed by their own names.
 *
 * Every key here is a name lucide does not have, so nothing is shadowed: an
 * `<oct-icon name="Receipt">` anywhere in the app still draws lucide's receipt.
 * Adopting an hr-icons mark is therefore a visible edit at the call site rather
 * than a swap underneath call sites nobody reviewed — which is why the entries
 * are exactly the marks the main sidebar asks for, and grow one at a time as
 * other screens choose them.
 */
export const HR_ICON_OVERRIDES = {
  Client,
  Invoice,
  Onboarding,
  PayRun,
  Payslip,
  Team,
  Timesheet
} satisfies Record<string, IconDefinition>;

/** Anything `oct-icon` will accept: every lucide name, plus the marks above. */
export type OctIconName = keyof typeof icons | keyof typeof HR_ICON_OVERRIDES;

@Component({
  selector: 'oct-icon',
  imports: [LucideAngularModule, HrIconComponent],
  template: `
    @if (hrIcon(); as icon) {
      <!-- no strokeWidth unless the caller asked: hr-icons carries its
           own resting weight per optical master -->
      <hr-icon [icon]="icon" [size]="computedSize()" [strokeWidth]="strokeWidth()" />
    } @else if (iconImg()) {
      <lucide-angular [img]="iconImg()" [size]="computedSize()" [strokeWidth]="computedStrokeWidth()" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClass()'
  },
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    `
  ]
})
export class IconComponent {
  name = input.required<OctIconName | (string & {})>();
  class = input<string>('');
  size = input<IconSize | number>('md');
  /**
   * Leave unset to follow the hr-icons weight. Lucide draws on a 24 grid
   * whatever the rendered size, so a single stroke value cannot match a set
   * that switches optical master at 18px — see `computedStrokeWidth`.
   */
  strokeWidth = input<number | undefined>(undefined);
  color = input<IconColor | undefined>(undefined);

  private readonly sizeMap: Record<IconSize, number> = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24
  };

  private readonly colorMap: Record<IconColor, string> = {
    error: 'text-error',
    success: 'text-success',
    disabled: 'text-hr-neutral-600',
    primary: 'text-primary',
    neutral: 'text-1'
  };

  computedSize = computed(() => {
    const size = this.size();
    return typeof size === 'number' ? size : this.sizeMap[size];
  });

  /**
   * Matches the rendered stroke of hr-icons so the two sets read
   * as one family.
   *
   * hr-icons draws a dedicated 16-unit master at or below 18px, where a
   * declared 1.25 renders as 1.25px. Lucide has only a 24-unit master, so its
   * declared width is scaled by size/24 — reaching that same 1.25px at 16px
   * needs 1.875. Above the breakpoint both sets are on a 24 grid and 1.5 lines
   * up directly. 18 is hr-icons' own OPTICAL_BREAKPOINT, so the two sets
   * change gear at the same size.
   */
  computedStrokeWidth = computed(() => this.strokeWidth() ?? (this.computedSize() <= 18 ? 1.875 : 1.5));

  computedClass = computed(() => {
    const baseClass = this.class();
    const colorValue = this.color();
    const colorClass = colorValue ? this.colorMap[colorValue] : '';
    return [baseClass, colorClass].filter(Boolean).join(' ');
  });

  hrIcon = computed(() => HR_ICON_OVERRIDES[this.name() as keyof typeof HR_ICON_OVERRIDES] ?? null);

  iconImg = computed(() => {
    const iconName = this.name();
    const icon = icons[iconName as keyof typeof icons];
    if (!icon) {
      console.warn(`Icon "${iconName}" not found in lucide-angular icons`);
    }
    return icon;
  });
}
