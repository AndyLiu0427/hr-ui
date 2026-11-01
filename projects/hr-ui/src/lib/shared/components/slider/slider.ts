import { Component, input, output, signal, computed, ChangeDetectionStrategy, ElementRef, viewChild, effect } from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TextComponent } from '../text/text';

// Types
export type SliderColorVariant = 'primary' | 'neutral';

export interface PercentageChangeEvent {
  left: number;
  right: number;
}

export interface SliderInputs {
  leftPercent: number;
  rightPercent: number;
  leftLabel: string;
  rightLabel: string;
  leftColor?: SliderColorVariant;
  rightColor?: SliderColorVariant;
}

@Component({
  selector: 'oct-slider',
  imports: [TextComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Wrapper container for consistent width -->
    <div class="w-full min-w-[200px] max-w-[400px] ">
      <!-- Labels above slider (optional) -->
      @if (showLabels()) {
        <div class="relative mb-2 flex justify-between">
          <div
            [class.cursor-pointer]="leftLabelClickable()"
            [class.underline]="leftLabelClickable()"
            [class.hover:opacity-80]="leftLabelClickable()"
            [class.transition-opacity]="leftLabelClickable()"
            (click)="onLeftLabelClick($event)"
          >
            <oct-text color="3" variant="xs" weight="regular">{{ leftLabel() }} ({{ displayLeftPercent() }}%)</oct-text>
          </div>
          <div
            [class.cursor-pointer]="rightLabelClickable()"
            [class.underline]="rightLabelClickable()"
            [class.hover:opacity-80]="rightLabelClickable()"
            [class.transition-opacity]="rightLabelClickable()"
            (click)="onRightLabelClick($event)"
          >
            <oct-text color="3" variant="xs" weight="regular">{{ rightLabel() }} ({{ displayRightPercent() }}%)</oct-text>
          </div>
        </div>
      }

      <div
        #sliderContainer
        class="relative h-5 w-full cursor-pointer"
        role="slider"
        [attr.aria-valuenow]="displayLeftPercent()"
        [attr.aria-valuemin]="0"
        [attr.aria-valuemax]="100"
        [attr.aria-label]="leftLabel() + ' percentage: ' + displayLeftPercent() + '%'"
        [attr.tabindex]="0"
        (keydown)="onKeyDown($event)"
        (click)="onSliderClick($event)"
      >
        <!-- Left progress bar -->
        <div
          class="absolute top-1.5 left-0 h-2 rounded-full transition-all duration-300 ease-out"
          [class.bg-primary-600]="leftColor() === 'primary'"
          [class.bg-hr-neutral-800]="leftColor() === 'neutral'"
          [style.width.%]="displayLeftPercent()"
        ></div>

        <!-- Right progress bar -->
        <div
          class="absolute top-1.5 right-0 h-2 rounded-full transition-all duration-300 ease-out"
          [class.bg-primary-600]="rightColor() === 'primary'"
          [class.bg-hr-neutral-800]="rightColor() === 'neutral'"
          [style.width.%]="displayRightPercent()"
        ></div>

        <!-- Draggable knob -->
        <div
          #knob
          class="absolute top-0 h-5 w-5 rounded-full transition-all duration-300 ease-out"
          [class.cursor-grab]="!isDragging()"
          [class.cursor-grabbing]="isDragging()"
          [class.bg-primary-600]="leftColor() === 'primary'"
          [class.bg-hr-neutral-800]="leftColor() === 'neutral'"
          [style.left.%]="displayLeftPercent()"
          [style.transform]="'translateX(-50%)'"
          (mousedown)="onKnobMouseDown($event)"
          (touchstart)="onKnobTouchStart($event)"
        >
          <!-- Inner circle -->
          <div
            class="absolute inset-0.25 rounded-full"
            [class.bg-white]="leftColor() === 'primary'"
            [class.bg-hr-neutral-50]="leftColor() === 'neutral'"
          ></div>
        </div>
      </div>

      <!-- Tick marks (optional percentage scale) -->
      @if (showTicks()) {
        <div class="relative -mx-2 flex justify-between">
          @for (tick of tickMarks(); track tick) {
            <div class="flex flex-col items-center">
              <!-- Tick mark line -->
              <div
                class="h-2 w-px cursor-pointer transition-colors hover:bg-primary-600"
                [class.bg-hr-neutral-300]="tick !== displayLeftPercent()"
                [class.bg-primary-600]="tick === displayLeftPercent()"
                (click)="onTickClick(tick, $event)"
              ></div>
              <!-- Tick label -->
              <span
                class="mt-1 text-xs cursor-pointer select-none transition-colors hover:text-primary-600"
                [class.text-hr-neutral-500]="tick !== displayLeftPercent()"
                [class.text-primary-600]="tick === displayLeftPercent()"
                [class.font-semibold]="tick === displayLeftPercent()"
                (click)="onTickClick(tick, $event)"
              >
                {{ tick }}
              </span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class SliderComponent {
  leftPercent = input.required<number>();
  rightPercent = input.required<number>();
  leftLabel = input.required<string>();
  rightLabel = input.required<string>();
  leftColor = input<SliderColorVariant>('primary');
  rightColor = input<SliderColorVariant>('neutral');
  showLabels = input<boolean>(true);
  showTicks = input<boolean>(false);
  step = input<number>(1);
  leftLabelClickable = input<boolean>(false);
  rightLabelClickable = input<boolean>(false);

  percentageChange = output<PercentageChangeEvent>();
  sliderClick = output<void>();
  leftLabelClick = output<void>();
  rightLabelClick = output<void>();

  // View children
  sliderContainer = viewChild.required<ElementRef<HTMLDivElement>>('sliderContainer');
  knob = viewChild.required<ElementRef<HTMLDivElement>>('knob');

  // Internal state
  protected isDragging = signal(false);
  private startX = signal(0);
  private startPercent = signal(0);
  private dragThreshold = 5; // pixels
  private hasDragged = signal(false);
  private draggingLeftPercent = signal<number | null>(null);
  private percentageChangeSubject = new Subject<PercentageChangeEvent>();

  // Computed signals
  displayLeftPercent = computed(() => {
    const dragging = this.draggingLeftPercent();
    if (dragging !== null) {
      return Math.round(dragging);
    }
    return this.leftPercent();
  });

  displayRightPercent = computed(() => {
    return 100 - this.displayLeftPercent();
  });

  // Generate tick marks array (0, 10, 20, ..., 100)
  tickMarks = computed(() => {
    return Array.from({ length: 11 }, (_, i) => i * 10);
  });

  constructor() {
    // Set up debounced emission
    this.percentageChangeSubject.pipe(debounceTime(300), takeUntilDestroyed()).subscribe((value: PercentageChangeEvent) => {
      this.percentageChange.emit(value);
    });

    // Clean up on drag end
    effect(() => {
      if (!this.isDragging()) {
        this.draggingLeftPercent.set(null);
      }
    });
  }

  onKnobMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.isDragging.set(true);
    this.hasDragged.set(false);
    this.startX.set(event.clientX);
    this.startPercent.set(this.displayLeftPercent());

    // Add global listeners
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onKnobTouchStart(event: TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.isDragging.set(true);
    this.hasDragged.set(false);
    this.startX.set(event.touches[0].clientX);
    this.startPercent.set(this.displayLeftPercent());

    // Add global listeners
    document.addEventListener('touchmove', this.onTouchMove, { passive: false });
    document.addEventListener('touchend', this.onTouchEnd);
  }

  private onMouseMove = (event: MouseEvent): void => {
    if (!this.isDragging()) return;

    const slider = this.sliderContainer().nativeElement;
    const rect = slider.getBoundingClientRect();
    const deltaX = event.clientX - this.startX();

    // Check if moved beyond threshold
    if (Math.abs(deltaX) > this.dragThreshold) {
      this.hasDragged.set(true);
    }

    const deltaPercent = (deltaX / rect.width) * 100;
    let newLeftPercent = this.startPercent() + deltaPercent;
    newLeftPercent = Math.max(0, Math.min(100, newLeftPercent)); // Clamp 0-100

    this.updatePercentages(newLeftPercent);
  };

  private onTouchMove = (event: TouchEvent): void => {
    if (!this.isDragging()) return;

    event.preventDefault(); // Prevent scrolling

    const slider = this.sliderContainer().nativeElement;
    const rect = slider.getBoundingClientRect();
    const deltaX = event.touches[0].clientX - this.startX();

    // Check if moved beyond threshold
    if (Math.abs(deltaX) > this.dragThreshold) {
      this.hasDragged.set(true);
    }

    const deltaPercent = (deltaX / rect.width) * 100;
    let newLeftPercent = this.startPercent() + deltaPercent;
    newLeftPercent = Math.max(0, Math.min(100, newLeftPercent)); // Clamp 0-100

    this.updatePercentages(newLeftPercent);
  };

  private onMouseUp = (): void => {
    if (!this.hasDragged()) {
      // This was a click, not a drag
      this.sliderClick.emit();
    }

    this.isDragging.set(false);
    this.draggingLeftPercent.set(null);

    // Remove global listeners
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  private onTouchEnd = (): void => {
    if (!this.hasDragged()) {
      // This was a tap, not a drag
      this.sliderClick.emit();
    }

    this.isDragging.set(false);
    this.draggingLeftPercent.set(null);

    // Remove global listeners
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
  };

  onSliderClick(event: MouseEvent): void {
    // Get the knob element to check if it was clicked
    const knobElement = this.knob().nativeElement;
    const target = event.target as HTMLElement;

    // Only handle clicks that are not on the knob or its children
    if (!knobElement.contains(target)) {
      const slider = this.sliderContainer().nativeElement;
      const rect = slider.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const newLeftPercent = (clickX / rect.width) * 100;

      this.updatePercentages(Math.max(0, Math.min(100, newLeftPercent)));
    }
  }

  onTickClick(tickValue: number, event: MouseEvent): void {
    event.stopPropagation(); // Prevent slider click event
    this.updatePercentages(tickValue);
  }

  onKeyDown(event: KeyboardEvent): void {
    let newLeftPercent = this.displayLeftPercent();
    let handled = false;
    const stepValue = this.step();

    switch (event.key) {
      case 'ArrowRight':
        newLeftPercent += event.shiftKey ? stepValue * 10 : stepValue;
        handled = true;
        break;
      case 'ArrowLeft':
        newLeftPercent -= event.shiftKey ? stepValue * 10 : stepValue;
        handled = true;
        break;
      case 'Home':
        newLeftPercent = 0;
        handled = true;
        break;
      case 'End':
        newLeftPercent = 100;
        handled = true;
        break;
    }

    if (handled) {
      event.preventDefault();
      newLeftPercent = Math.max(0, Math.min(100, newLeftPercent));
      this.updatePercentages(newLeftPercent);
    }
  }

  private updatePercentages(newLeftPercent: number): void {
    let finalPercent = newLeftPercent;

    // Apply step snapping first
    const stepValue = this.step();
    if (stepValue > 1) {
      finalPercent = Math.round(finalPercent / stepValue) * stepValue;
    }

    // If ticks are enabled, also snap to tick marks (0, 10, 20, ..., 100)
    if (this.showTicks()) {
      finalPercent = this.snapToNearestTick(finalPercent);
    }

    // Update temporary drag state
    this.draggingLeftPercent.set(finalPercent);

    // Emit debounced change
    const left = Math.round(finalPercent);
    const right = 100 - left;
    this.percentageChangeSubject.next({ left, right });
  }

  private snapToNearestTick(percent: number): number {
    // Snap to nearest multiple of 10 (0, 10, 20, ..., 100)
    return Math.round(percent / 10) * 10;
  }

  onLeftLabelClick(event: MouseEvent): void {
    if (this.leftLabelClickable()) {
      event.stopPropagation();
      this.leftLabelClick.emit();
    }
  }

  onRightLabelClick(event: MouseEvent): void {
    if (this.rightLabelClickable()) {
      event.stopPropagation();
      this.rightLabelClick.emit();
    }
  }
}
