import { Component } from '@angular/core';
import {
  AvatarComponent,
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  CardContentComponent,
  CardFooterComponent,
  CardHeaderComponent
} from 'ngx-hr-ui';

@Component({
  selector: 'example-card-demo',
  imports: [AvatarComponent, BadgeComponent, ButtonComponent, CardComponent, CardContentComponent, CardFooterComponent, CardHeaderComponent],
  host: { class: 'w-full max-w-sm' },
  template: `
    <oct-card>
      <oct-card-header>
        <div class="flex items-center gap-3">
          <oct-avatar name="Mei Lin Chen" />
          <div class="min-w-0">
            <h3 class="font-semibold text-1">Mei Lin Chen</h3>
            <p class="text-sm text-3">Senior payroll analyst</p>
          </div>
        </div>
      </oct-card-header>
      <oct-card-content>
        <dl class="grid grid-cols-2 gap-4 text-sm">
          @for (field of fields; track field.label) {
            <div>
              <dt class="text-3">{{ field.label }}</dt>
              <dd class="mt-1 text-1">{{ field.value }}</dd>
            </div>
          }
        </dl>
      </oct-card-content>
      <oct-card-footer>
        <oct-badge text="Active" color="success" />
        <oct-button variant="outline" color="neutral" size="sm">View profile</oct-button>
      </oct-card-footer>
    </oct-card>
  `
})
export default class CardDemo {
  readonly fields = [
    { label: 'Employee code', value: 'EMP-01042' },
    { label: 'Department', value: 'Finance' },
    { label: 'Start date', value: '1 Mar 2021' },
    { label: 'Work location', value: 'Singapore' }
  ];
}
