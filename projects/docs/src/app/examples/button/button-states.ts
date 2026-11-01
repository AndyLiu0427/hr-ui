import { Component, signal } from '@angular/core';
import { ButtonComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-button-states',
  imports: [ButtonComponent],
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <oct-button [loading]="saving()" (buttonClick)="save()">{{ saving() ? 'Saving' : 'Save draft' }}</oct-button>
      <oct-button [disabled]="true">Disabled</oct-button>
      <oct-button variant="outline" color="neutral" [disabled]="true">Disabled</oct-button>
    </div>
  `
})
export default class ButtonStates {
  readonly saving = signal(false);

  save(): void {
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 1500);
  }
}
