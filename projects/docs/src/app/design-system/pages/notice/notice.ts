import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

import { TitleCasePipe } from '@angular/common';
import { NoticeComponent, NoticeVariant } from 'ngx-hr-ui';
import { ButtonComponent } from 'ngx-hr-ui';
import { CardComponent, CardContentComponent, CardHeaderComponent } from 'ngx-hr-ui';
import { CheckboxComponent } from 'ngx-hr-ui';
import { IconComponent } from 'ngx-hr-ui';
import { InputComponent } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';

@Component({
  selector: 'oct-notice-page',
  templateUrl: './notice.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TitleCasePipe,
    NoticeComponent,
    ButtonComponent,
    IconComponent,
    InputComponent,
    TextComponent,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    CheckboxComponent
  ]
})
export class NoticePageComponent {
  readonly config = signal({
    variant: 'info' as NoticeVariant,
    message: 'This is a notice message',
    icon: '',
    showDefaultIcon: true,
    dismissible: false,
    showAction: false,
    actionLabel: 'View'
  });

  readonly variantOptions: NoticeVariant[] = ['info', 'success', 'warning', 'error'];
  readonly iconOptions = ['', 'Info', 'CircleCheck', 'TriangleAlert', 'CircleAlert', 'CircleX', 'Bell', 'Lightbulb'];

  readonly dismissibleExampleVisible = signal(true);

  updateVariant(variant: NoticeVariant, message?: string): void {
    this.config.update(c => ({ ...c, variant, message: message || c.message }));
  }

  updateMessage(message: string): void {
    this.config.update(c => ({ ...c, message }));
  }

  updateIcon(icon: string): void {
    this.config.update(c => ({ ...c, icon }));
  }

  updateShowDefaultIcon(showDefaultIcon: boolean): void {
    this.config.update(c => ({ ...c, showDefaultIcon }));
  }

  updateDismissible(dismissible: boolean): void {
    this.config.update(c => ({ ...c, dismissible }));
  }

  updateShowAction(showAction: boolean): void {
    this.config.update(c => ({ ...c, showAction }));
  }

  updateActionLabel(actionLabel: string): void {
    this.config.update(c => ({ ...c, actionLabel }));
  }

  resetDismissibleExample(): void {
    this.dismissibleExampleVisible.set(true);
  }
}
