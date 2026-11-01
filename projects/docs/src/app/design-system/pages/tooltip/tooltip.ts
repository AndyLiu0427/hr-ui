import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { TooltipDirective, type TooltipPosition, type TooltipColor } from 'hr-ui';
import { ButtonComponent } from 'hr-ui';
import { CardComponent, CardContentComponent } from 'hr-ui';
import { CheckboxComponent } from 'hr-ui';
import { InputComponent } from 'hr-ui';
import { TextComponent } from 'hr-ui';

@Component({
  selector: 'app-tooltip-page',
  templateUrl: './tooltip.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TooltipDirective, ButtonComponent, CardComponent, CardContentComponent, CheckboxComponent, InputComponent, TextComponent]
})
export class TooltipPageComponent {
  readonly position = signal<TooltipPosition>('top');
  readonly color = signal<TooltipColor>('default');
  readonly text = signal('Add to library');
  readonly showDelay = signal(200);
  readonly disabled = signal(false);

  readonly positions: TooltipPosition[] = ['top', 'bottom', 'left', 'right'];
  readonly colors: TooltipColor[] = ['default', 'primary', 'blue', 'red', 'purple', 'amber'];
}
