import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Type } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { IconComponent } from 'ngx-hr-ui';
import { DocsCodeComponent } from '../docs/docs-code';
import ShowcaseEmployee from '../examples/showcase/showcase-employee';
import ShowcaseLeaveRequest from '../examples/showcase/showcase-leave-request';
import ShowcaseNotifications from '../examples/showcase/showcase-notifications';
import ShowcasePayRun from '../examples/showcase/showcase-pay-run';

// Two columns, top to bottom. Not lazy, so the page does not jump when they arrive.
const SHOWCASE: Type<unknown>[][] = [
  [ShowcasePayRun, ShowcaseNotifications],
  [ShowcaseEmployee, ShowcaseLeaveRequest]
];

@Component({
  selector: 'docs-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet, RouterLink, IconComponent, DocsCodeComponent],
  template: `
    <section class="relative overflow-hidden border-b border-docs-border">
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 [background-image:radial-gradient(var(--docs-border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"></div>
      <div class="relative mx-auto flex max-w-3xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
        <a
          routerLink="/docs/theming"
          class="oct-focus-ring mb-6 inline-flex items-center gap-2 rounded-full border border-docs-border bg-docs-bg px-3 py-1 text-xs font-medium text-docs-muted transition-colors duration-150 hover:text-docs-fg"
        >
          <span class="size-1.5 rounded-full bg-primary-solid"></span>
          New: pick your brand color in one line
          <oct-icon name="ArrowRight" [size]="12" />
        </a>
        <h1 class="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">Components for HR and payroll apps</h1>
        <p class="mt-5 max-w-xl text-base leading-7 text-docs-muted text-pretty sm:text-lg">
          Accessible Angular components with Tailwind CSS 4 tokens, dark mode and one-line theming. Built for
          the forms, tables and approvals these products are made of.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <a
            routerLink="/docs/installation"
            class="oct-focus-ring inline-flex h-10 items-center gap-2 rounded-lg bg-docs-fg px-5 text-sm font-medium text-docs-bg transition-opacity duration-150 hover:opacity-90"
            >Get started</a
          >
          <a
            routerLink="/docs/components"
            class="oct-focus-ring inline-flex h-10 items-center gap-2 rounded-lg border border-docs-border bg-docs-bg px-5 text-sm font-medium transition-colors duration-150 hover:bg-docs-hover"
            >Browse components</a
          >
        </div>
        <div class="mt-8 w-full max-w-sm text-left">
          <docs-code language="shellscript" [code]="'npm install ngx-hr-ui'" />
        </div>
      </div>
    </section>

    <section aria-labelledby="showcase-title" class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6">
      <h2 id="showcase-title" class="sr-only">Examples built with hr-ui</h2>
      <div class="grid items-start gap-4 lg:grid-cols-[1.15fr_1fr]">
        @for (column of columns; track $index) {
          <div class="flex min-w-0 flex-col gap-4">
            @for (component of column; track $index) {
              <div class="min-w-0 overflow-hidden rounded-2xl border border-docs-border bg-docs-bg p-5 sm:p-6">
                <ng-container *ngComponentOutlet="component" />
              </div>
            }
          </div>
        }
      </div>
    </section>

    <section class="border-t border-docs-border">
      <div class="mx-auto grid max-w-screen-xl gap-x-10 gap-y-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        @for (feature of features; track feature.title) {
          <div>
            <oct-icon [name]="feature.icon" [size]="20" class="text-primary" />
            <h3 class="mt-3 font-semibold tracking-tight">{{ feature.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-docs-muted">{{ feature.text }}</p>
          </div>
        }
      </div>
    </section>
  `
})
export class HomePage {
  protected readonly columns = SHOWCASE;

  protected readonly features = [
    { icon: 'Accessibility', title: 'Accessible', text: 'WCAG AA contrast in both themes, focus rings for keyboard users, and dialogs and menus that manage focus.' },
    { icon: 'Palette', title: 'Themeable', text: 'Two CSS variables set your brand color. Every shade and every role follows, in light and dark mode.' },
    { icon: 'Moon', title: 'Dark mode', text: 'One class on the page flips every component. A toggle and a service come with it.' },
    { icon: 'Zap', title: 'Angular 22', text: 'Standalone components, signals and signal forms, with strict types for templates.' }
  ];

  constructor() {
    inject(Title).setTitle('hr-ui · Components for HR and payroll apps');
  }
}
