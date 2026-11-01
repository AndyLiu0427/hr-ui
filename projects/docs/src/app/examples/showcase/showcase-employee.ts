import { Component } from '@angular/core';
import { AvatarComponent, BadgeComponent, ButtonComponent, DateTimelineComponent, TextComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-showcase-employee',
  imports: [AvatarComponent, BadgeComponent, ButtonComponent, DateTimelineComponent, TextComponent],
  template: `
    <div class="flex flex-col gap-5">
      <div class="flex items-center gap-4">
        <oct-avatar name="Mei Lin Chen" size="lg" status="online" />
        <div class="min-w-0 flex-1">
          <oct-text variant="md" color="1" weight="semibold">Mei Lin Chen</oct-text>
          <oct-text variant="sm" color="3">Senior payroll analyst · Finance</oct-text>
        </div>
        <oct-button variant="ghost" color="neutral" shape="square" icon="Ellipsis" ariaLabel="More actions" />
      </div>
      <div class="flex flex-wrap gap-2">
        <oct-badge text="Full-time" />
        <oct-badge text="Singapore" icon="MapPin" />
        <oct-badge text="Active" color="success" />
      </div>
      <div>
        <oct-text variant="xs" color="3" class="mb-2">Contract history</oct-text>
        <oct-date-timeline [nodes]="history" />
      </div>
    </div>
  `
})
export default class ShowcaseEmployee {
  readonly history = [{ date: '2021-03-01' }, { date: '2023-07-01' }, { date: '2025-01-01', emphasis: true }];
}
