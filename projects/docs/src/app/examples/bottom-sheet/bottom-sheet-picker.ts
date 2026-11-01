import { Component, signal } from '@angular/core';
import { BottomSheetComponent, ButtonComponent, IconComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-bottom-sheet-picker',
  imports: [BottomSheetComponent, ButtonComponent, IconComponent],
  template: `
    <oct-button variant="outline" color="neutral" icon="Calendar" (buttonClick)="open.set(true)">Pay period: {{ period() }}</oct-button>

    <oct-bottom-sheet title="Choose a pay period" [isOpen]="open()" (closed)="open.set(false)">
      <div class="flex flex-col p-2">
        @for (month of months; track month) {
          <button
            type="button"
            class="oct-focus-ring flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm text-1 hover:bg-hr-neutral-900"
            [attr.aria-current]="month === period() ? 'true' : null"
            (click)="choose(month)"
          >
            {{ month }}
            @if (month === period()) {
              <oct-icon name="Check" size="sm" class="text-primary" />
            }
          </button>
        }
      </div>
    </oct-bottom-sheet>
  `
})
export default class BottomSheetPicker {
  readonly months = ['November 2026', 'October 2026', 'September 2026', 'August 2026', 'July 2026', 'June 2026'];
  readonly period = signal('October 2026');
  readonly open = signal(false);

  choose(month: string): void {
    this.period.set(month);
    this.open.set(false);
  }
}
