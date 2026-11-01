import { BadgeComponent } from '../badge/badge';
import { ColorTagComponent } from '../color-tag/color-tag';
import { IconComponent } from '../icon/icon';
import { TextComponent } from '../text/text';

import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { SearchSelectOption } from './search-select';

@Component({
  selector: 'oct-search-select-option',
  template: `
    <div
      [class]="optionClasses()"
      [attr.id]="optionId()"
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
        <div class="flex items-center gap-1.5">
          @if (option().colorTag) {
            <oct-color-tag variant="inline" [color]="option().colorTag!" />
          }
          <oct-text color="1" variant="xs" class="truncate flex-1 min-w-0" [title]="option().label">{{ option().label }}</oct-text>
          @if (option().badge) {
            <oct-badge class="shrink-0" [text]="option().badge!.text" [color]="option().badge!.color ?? 'neutral'" size="sm" />
          }
        </div>
        @if (option().description) {
          <oct-text color="3" variant="xs" class="truncate" [title]="option().description">{{ option().description }}</oct-text>
        }
      </div>

      @if (option().icon && showIcon()) {
        <oct-icon [name]="option().icon!" class="text-1 ml-2"></oct-icon>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, ColorTagComponent, IconComponent, TextComponent],
  host: {
    '[class.highlighted]': 'highlighted()',
    '[class.selected]': 'selected()',
    '[class.disabled]': 'option().disabled'
  }
})
export class SearchSelectOptionComponent {
  readonly option = input.required<SearchSelectOption>();
  readonly selected = input<boolean>(false);
  readonly highlighted = input<boolean>(false);
  readonly showCheckIcon = input<boolean>(true);
  readonly showIcon = input<boolean>(true);
  /** Id of the element with role="option", which the search box's aria-activedescendant names. */
  readonly optionId = input<string>();

  readonly optionClick = output<SearchSelectOption>();
  readonly optionHover = output<SearchSelectOption>();

  readonly optionClasses = computed(() => {
    const baseClasses = ['search-select-option', 'flex', 'items-center', 'px-2', 'py-1.5', 'cursor-pointer', 'text-sm', 'rounded-lg'];

    const option = this.option();

    if (option.disabled) {
      baseClasses.push('bg-hr-neutral-900', 'cursor-not-allowed', 'text-disabled');
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
