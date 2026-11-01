import { Component, signal } from '@angular/core';
import { ButtonComponent, DialogComponent, DialogContentComponent, DialogFooterComponent, DialogHeaderComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-dialog-scroll',
  imports: [ButtonComponent, DialogComponent, DialogHeaderComponent, DialogContentComponent, DialogFooterComponent],
  template: `
    <oct-button variant="outline" color="neutral" icon="FileText" (buttonClick)="open.set(true)">Read leave policy</oct-button>

    <!-- maxHeight caps the dialog. The content scrolls; the header and footer stay in view. -->
    <oct-dialog [isOpen]="open()" maxHeight="80vh" (dialogClose)="open.set(false)">
      <oct-dialog-header>Leave policy 2026</oct-dialog-header>
      <oct-dialog-content>
        @for (section of sections; track section.title) {
          <h3 class="mt-4 text-sm font-semibold text-1 first:mt-0">{{ section.title }}</h3>
          <p class="mt-1 text-sm leading-6 text-2">{{ section.text }}</p>
        }
      </oct-dialog-content>
      <oct-dialog-footer>
        <oct-button class="ml-auto" (buttonClick)="open.set(false)">I have read it</oct-button>
      </oct-dialog-footer>
    </oct-dialog>
  `
})
export default class DialogScroll {
  readonly open = signal(false);
  readonly sections = [
    { title: 'Annual leave', text: 'Full-time employees get 14 days a year, plus 1 day for each year of service, up to 21 days.' },
    { title: 'Carry forward', text: 'You can carry up to 5 unused days into the next year. Carried days expire on 31 March.' },
    { title: 'Sick leave', text: 'You get 14 days of outpatient sick leave a year. A medical certificate is needed for each absence.' },
    { title: 'Hospitalisation leave', text: 'You get up to 60 days a year, including the 14 days of outpatient sick leave.' },
    { title: 'Childcare leave', text: 'Parents of a child under 7 get 6 days a year. Parents of a child aged 7 to 12 get 2 days.' },
    { title: 'Unpaid leave', text: 'Ask your manager at least 2 weeks before. Unpaid leave reduces your pay for that month.' },
    { title: 'Public holidays', text: 'If a public holiday falls on a rest day, the next working day is a paid day off.' },
    { title: 'Applying', text: 'Apply in the app at least 3 working days before. Your manager approves or rejects the request.' }
  ];
}
