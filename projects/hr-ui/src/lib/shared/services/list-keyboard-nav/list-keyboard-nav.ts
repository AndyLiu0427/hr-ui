import { signal } from '@angular/core';

export interface NavItem {
  disabled?: boolean;
}

export interface MoveOptions {
  wrap?: boolean;
  skipDisabled?: boolean;
}

/**
 * Shared keyboard-navigation primitive for overlay dropdown lists.
 * Tracks the active option by DATA index (not rendered component), so regular
 * and `*cdkVirtualFor` lists behave identically. The host binds the highlight
 * via `[highlighted]="i === nav.activeIndex()"`.
 */
export class ListKeyboardNav<T extends NavItem> {
  private readonly _activeIndex = signal(-1);
  readonly activeIndex = this._activeIndex.asReadonly();

  private items: readonly T[] = [];

  /**
   * Replace the option set and reset the highlight to `preferredIndex` (when it
   * points at an enabled option), else the first enabled option, else -1.
   */
  setOptions(items: readonly T[], preferredIndex?: number): void {
    this.items = items;

    if (preferredIndex != null && this.isSelectable(preferredIndex)) {
      this._activeIndex.set(preferredIndex);
      return;
    }

    this._activeIndex.set(this.firstEnabledIndex());
  }

  move(delta: number, { wrap = true, skipDisabled = true }: MoveOptions = {}): void {
    if (this.items.length === 0) {
      this._activeIndex.set(-1);
      return;
    }

    const step = delta > 0 ? 1 : -1;
    let index = this._activeIndex();

    for (let guard = 0; guard < this.items.length; guard++) {
      index += step;

      if (index < 0) {
        if (!wrap) return;
        index = this.items.length - 1;
      } else if (index >= this.items.length) {
        if (!wrap) return;
        index = 0;
      }

      if (!skipDisabled || !this.items[index].disabled) {
        this._activeIndex.set(index);
        return;
      }
    }
  }

  /** Drop the highlight to -1 while keeping the options (e.g. oct-select's Select-All row). */
  clearActive(): void {
    this._activeIndex.set(-1);
  }

  setActive(index: number): void {
    if (index >= 0 && index < this.items.length) {
      this._activeIndex.set(index);
    }
  }

  first(): void {
    this._activeIndex.set(this.firstEnabledIndex());
  }

  last(): void {
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (!this.items[i].disabled) {
        this._activeIndex.set(i);
        return;
      }
    }
    this._activeIndex.set(-1);
  }

  private firstEnabledIndex(): number {
    for (let i = 0; i < this.items.length; i++) {
      if (!this.items[i].disabled) return i;
    }
    return -1;
  }

  private isSelectable(index: number): boolean {
    return index >= 0 && index < this.items.length && !this.items[index].disabled;
  }
}
