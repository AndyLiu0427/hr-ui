import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ChipColor, ChipComponent, ChipVariant, TextComponent } from 'ngx-hr-ui';

@Component({
  selector: 'oct-chip-page',
  templateUrl: './chip.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChipComponent, TextComponent]
})
export class ChipPageComponent {
  readonly variants: ChipVariant[] = ['soft', 'outline', 'solid'];
  readonly colors: ChipColor[] = ['neutral', 'success', 'warning', 'error', 'info'];
  readonly keywords = signal(['INV REQ', 'PO', 'Timesheet', 'Q3']);

  removeKeyword(index: number): void {
    this.keywords.update(list => list.filter((_, i) => i !== index));
  }
}
