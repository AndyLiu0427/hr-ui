import { Component, signal } from '@angular/core';
import { BottomSheetComponent, ButtonComponent, IconComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-bottom-sheet-demo',
  imports: [BottomSheetComponent, ButtonComponent, IconComponent],
  template: `
    <oct-button variant="outline" color="neutral" icon="FileText" (buttonClick)="open.set(true)">October payslip</oct-button>

    <oct-bottom-sheet title="October payslip" [isOpen]="open()" (closed)="open.set(false)">
      <div class="flex flex-col p-2">
        @for (action of actions; track action.label) {
          <button
            type="button"
            class="oct-focus-ring flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-1 hover:bg-hr-neutral-900"
            (click)="open.set(false)"
          >
            <oct-icon [name]="action.icon" size="sm" class="text-2" />
            {{ action.label }}
          </button>
        }
      </div>
    </oct-bottom-sheet>
  `
})
export default class BottomSheetDemo {
  readonly open = signal(false);
  readonly actions = [
    { icon: 'Download', label: 'Download PDF' },
    { icon: 'Mail', label: 'Email to me' },
    { icon: 'Printer', label: 'Print' }
  ];
}
