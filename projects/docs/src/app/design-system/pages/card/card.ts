import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { ButtonComponent } from 'ngx-hr-ui';
import {
  CardComponent,
  CardContentComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardPadding,
  CardStatus
} from 'ngx-hr-ui';
import { IconComponent } from 'ngx-hr-ui';
import { InputComponent } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';

interface CardVariant {
  variant: string;
  label: string;
  description: string;
}

interface CardExample {
  title: string;
  description: string;
  props: any;
  code: string;
}

interface StatusExample {
  status: CardStatus;
  title: string;
  description: string;
  code: string;
}

@Component({
  selector: 'oct-card-page',
  templateUrl: './card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TitleCasePipe,
    UpperCasePipe,
    IconComponent,
    ButtonComponent,
    InputComponent,
    TextComponent,
    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
    CardFooterComponent
  ]
})
export class CardPageComponent {
  // Card content state
  readonly cardTitle = signal('Create account');
  readonly cardDescription = signal('Create your account with one click.');
  readonly emailValue = signal('mail@email.com');
  readonly passwordValue = signal('Password');
  readonly customTitle = signal('Create account');
  readonly customDescription = signal('Create your account with one click.');
  readonly cardStatus = signal<CardStatus>('initial');
  readonly cardPadding = signal<CardPadding>('md');

  // Available options
  readonly paddingOptions: CardPadding[] = ['none', 'sm', 'md', 'lg'];
  readonly statusOptions: CardStatus[] = ['initial', 'success', 'error'];

  // UI state

  // Card variants for examples
  readonly variants: CardVariant[] = [
    { variant: 'basic', label: 'Basic', description: 'Simple card with content' },
    { variant: 'with-header', label: 'With Header', description: 'Card with header and content' },
    { variant: 'with-footer', label: 'With Footer', description: 'Card with content and footer' },
    { variant: 'complete', label: 'Complete', description: 'Full card with all sections' }
  ];

  // Card examples
  readonly cardExamples: CardExample[] = [
    {
      title: 'Basic Card',
      description: 'Simple card with just content',
      props: { variant: 'basic' },
      code: `<oct-card>
  <oct-card-content>
    <p class="text-1">This is a basic card with just content.</p>
  </oct-card-content>
</oct-card>`
    },
    {
      title: 'Card with Header',
      description: 'Card with header and content sections',
      props: { variant: 'with-header' },
      code: `<oct-card>
  <oct-card-header>
    <h3 class="text-1 text-xl font-semibold">Card Title</h3>
    <p class="text-3 text-sm">Card description text</p>
  </oct-card-header>
  <oct-card-content>
    <p class="text-1">This is card content with a header.</p>
  </oct-card-content>
</oct-card>`
    },
    {
      title: 'Complete Card',
      description: 'Full card with header, content, and footer',
      props: { variant: 'complete' },
      code: `<oct-card>
  <oct-card-header>
    <h3 class="text-1 text-xl font-semibold">Card Title</h3>
    <p class="text-3 text-sm">Card description text</p>
  </oct-card-header>
  <oct-card-content>
    <p class="text-1">This is a complete card with all sections.</p>
  </oct-card-content>
  <oct-card-footer>
    <oct-button variant="outline" color="gray" size="md">Cancel</oct-button>
    <oct-button variant="solid" color="primary" size="md">Confirm</oct-button>
  </oct-card-footer>
</oct-card>`
    }
  ];

  // Status examples
  readonly statusExamples: StatusExample[] = [
    {
      status: 'initial',
      title: 'Initial State',
      description: 'Default card appearance with standard border',
      code: `<oct-card [status]="'initial'">
  <oct-card-content>
    <oct-text color="1" variant="sm" weight="regular">
      This card is in its initial state with a standard border.
    </oct-text>
  </oct-card-content>
</oct-card>`
    },
    {
      status: 'success',
      title: 'Success State',
      description: 'Card with green border indicating successful validation',
      code: `<oct-card [status]="'success'">
  <oct-card-content>
    <oct-text color="1" variant="sm" weight="regular">
      This card shows a success state with a green border.
    </oct-text>
  </oct-card-content>
</oct-card>`
    },
    {
      status: 'error',
      title: 'Error State',
      description: 'Card with red border indicating validation errors',
      code: `<oct-card [status]="'error'">
  <oct-card-content>
    <oct-text color="1" variant="sm" weight="regular">
      This card shows an error state with a red border.
    </oct-text>
  </oct-card-content>
</oct-card>`
    }
  ];

  // Methods for interactive playground
  onTitleInputChange(value: string): void {
    this.customTitle.set(value);
    this.cardTitle.set(value);
  }

  onDescriptionInputChange(value: string): void {
    this.customDescription.set(value);
    this.cardDescription.set(value);
  }

  onEmailInputChange(value: string): void {
    this.emailValue.set(value);
  }

  onPasswordInputChange(value: string): void {
    this.passwordValue.set(value);
  }

  onStatusChange(status: CardStatus): void {
    this.cardStatus.set(status);
  }

  onPaddingChange(padding: CardPadding): void {
    this.cardPadding.set(padding);
  }

  applyPreset(preset: string): void {
    switch (preset) {
      case 'login':
        this.cardTitle.set('Sign In');
        this.cardDescription.set('Welcome back! Please sign in to your account.');
        this.customTitle.set('Sign In');
        this.customDescription.set('Welcome back! Please sign in to your account.');
        this.emailValue.set('user@example.com');
        this.passwordValue.set('••••••••');
        break;
      case 'signup':
        this.cardTitle.set('Create Account');
        this.cardDescription.set('Join us today! Create your new account.');
        this.customTitle.set('Create Account');
        this.customDescription.set('Join us today! Create your new account.');
        this.emailValue.set('');
        this.passwordValue.set('');
        break;
      case 'form':
        this.cardTitle.set('Contact Form');
        this.cardDescription.set("Send us a message and we'll get back to you.");
        this.customTitle.set('Contact Form');
        this.customDescription.set("Send us a message and we'll get back to you.");
        this.emailValue.set('your.email@domain.com');
        this.passwordValue.set('Your message...');
        break;
      case 'settings':
        this.cardTitle.set('Account Settings');
        this.cardDescription.set('Manage your account preferences.');
        this.customTitle.set('Account Settings');
        this.customDescription.set('Manage your account preferences.');
        this.emailValue.set('current@email.com');
        this.passwordValue.set('••••••••');
        break;
    }
  }

  getDisplayCode(): string {
    return `<oct-card>
  <oct-card-header>
    <oct-text color="1" variant="xl" weight="semibold">
      ${this.cardTitle()}
    </oct-text>
    <oct-text color="3" variant="sm" weight="regular">
      ${this.cardDescription()}
    </oct-text>
  </oct-card-header>
  <oct-card-content>
    <oct-input
      label="Email"
      placeholder="mail@email.com"
      value="${this.emailValue()}"
      type="email"
      size="md">
    </oct-input>
    <oct-input
      label="Password"
      placeholder="Password"
      value="${this.passwordValue()}"
      type="password"
      size="md">
    </oct-input>
  </oct-card-content>
  <oct-card-footer>
    <oct-button variant="outline" color="gray" size="md">Cancel</oct-button>
    <oct-button variant="solid" color="primary" size="md">Create</oct-button>
  </oct-card-footer>
</oct-card>`;
  }
}
