import { Component, signal } from '@angular/core';
import { ButtonComponent, TabsComponent, type TabItem } from 'ngx-hr-ui';

@Component({
  selector: 'example-tabs-locked',
  imports: [ButtonComponent, TabsComponent],
  host: { class: 'w-full max-w-md' },
  template: `
    <oct-tabs [tabs]="tabs" [(activeTab)]="activeTab" [interactive]="!editing()" />
    <div class="mt-4 flex items-center justify-between gap-3">
      <p class="text-sm text-3">{{ editing() ? 'Save to switch tabs again.' : 'Editing locks the other tabs.' }}</p>
      <oct-button size="sm" [variant]="editing() ? 'solid' : 'outline'" color="neutral" (buttonClick)="editing.set(!editing())">
        {{ editing() ? 'Save' : 'Edit' }}
      </oct-button>
    </div>
  `
})
export default class TabsLocked {
  readonly tabs: TabItem[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'payroll', label: 'Payroll' },
    { id: 'documents', label: 'Documents' }
  ];
  readonly activeTab = signal('payroll');
  readonly editing = signal(false);
}
