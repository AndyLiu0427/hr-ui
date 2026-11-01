import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RadioComponent } from 'ngx-hr-ui';
import { CardComponent, CardContentComponent, CardHeaderComponent } from 'ngx-hr-ui';
import { CheckboxComponent } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';

interface RadioOption {
  value: string;
  label: string;
}

@Component({
  selector: 'oct-radio-page',
  templateUrl: './radio.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RadioComponent, TextComponent, CardComponent, CardContentComponent, CardHeaderComponent, CheckboxComponent]
})
export class RadioPageComponent {
  // Interactive single-select group
  readonly options: RadioOption[] = [
    { value: 'standard', label: 'Standard rate' },
    { value: 'park', label: 'Park rate' },
    { value: 'no-park', label: 'No-park rate' }
  ];
  readonly selected = signal<string>('standard');
  readonly disabledGroup = signal(false);

  select(value: string): void {
    this.selected.set(value);
  }
}
