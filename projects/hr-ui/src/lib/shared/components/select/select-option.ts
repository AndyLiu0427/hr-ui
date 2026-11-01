import { Component, computed, input, output, ChangeDetectionStrategy } from '@angular/core';

import { TextComponent } from '../text/text';
import { ColorTagComponent } from '../color-tag/color-tag';
import { IconComponent } from '../icon/icon';
import { SelectOption } from './select';

@Component({
  selector: 'oct-select-option',
  template: `
    <div
      [class]="optionClasses()"
      [attr.aria-selected]="selected()"
      [attr.aria-disabled]="option().disabled"
      role="option"
      (click)="onSelect()"
      (mouseenter)="onMouseEnter()"
    >
      @if (selected() && showCheckIcon()) {
        <oct-icon name="Check" class="text-1 mr-2"></oct-icon>
      } @else {
        <div class="w-4 mr-2"></div>
      }

      <div class="flex-1 min-w-0">
        <!-- Colour mark and label share one line; the description sits below. -->
        <div class="flex items-center gap-2">
          @if (option().colorTag) {
            <oct-color-tag variant="inline" [color]="option().colorTag!" />
          }
          <oct-text [color]="option().disabled ? 'disabled' : '1'" variant="sm" class="truncate min-w-0" [title]="option().label">{{ option().label }}</oct-text>
        </div>
        @if (option().description) {
          <oct-text [color]="option().disabled ? 'disabled' : '3'" variant="xs" class="truncate" [title]="option().description">{{ option().description }}</oct-text>
        }
      </div>

      @if (option().icon && showIcon()) {
        <oct-icon [name]="option().icon!" class="text-1 ml-2"></oct-icon>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ColorTagComponent, IconComponent, TextComponent],
  host: {
    '[class.highlighted]': 'highlighted()',
    '[class.selected]': 'selected()',
    '[class.disabled]': 'option().disabled'
  }
})
export class SelectOptionComponent {
  readonly option = input.required<SelectOption>();
  readonly selected = input<boolean>(false);
  readonly highlighted = input<boolean>(false);
  readonly showCheckIcon = input<boolean>(true);
  readonly showIcon = input<boolean>(true);

  readonly optionClick = output<SelectOption>();
  readonly optionHover = output<SelectOption>();

  readonly optionClasses = computed(() => {
    const baseClasses = ['flex', 'items-center', 'px-2', 'py-1.5', 'cursor-pointer', 'text-sm', 'rounded-lg'];

    const option = this.option();

    if (option.disabled) {
      baseClasses.push('cursor-not-allowed', 'text-disabled');
    } else {
      if (this.selected()) {
        baseClasses.push('bg-hr-neutral-900', 'text-1', 'rounded-lg');
      } else if (this.highlighted()) {
        baseClasses.push('bg-hr-neutral-800', 'text-1', 'rounded-lg');
      } else {
        baseClasses.push('text-1');
      }
    }

    return baseClasses.join(' ');
  });

  onSelect(): void {
    if (!this.option().disabled) {
      this.optionClick.emit(this.option());
    }
  }

  onMouseEnter(): void {
    if (!this.option().disabled) {
      this.optionHover.emit(this.option());
    }
  }
}
