import { Component, signal } from '@angular/core';
import { ButtonComponent, ChipComponent } from 'ngx-hr-ui';

const SKILLS = ['Payroll', 'CPF submissions', 'Xero', 'Employment Act'];

@Component({
  selector: 'example-chip-demo',
  imports: [ButtonComponent, ChipComponent],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      @for (skill of skills(); track skill) {
        <oct-chip [label]="skill" removable [removeAriaLabel]="'Remove ' + skill" (remove)="remove(skill)" />
      } @empty {
        <span class="text-sm text-3">No skills left.</span>
        <oct-button variant="link" size="sm" (buttonClick)="skills.set(all)">Reset</oct-button>
      }
    </div>
  `
})
export default class ChipDemo {
  readonly all = SKILLS;
  readonly skills = signal(SKILLS);

  remove(skill: string): void {
    this.skills.update(skills => skills.filter(s => s !== skill));
  }
}
