import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

export interface IChoiceOption {
  value: string;
  label: string;
}

/**
 * Inline choice: a small set of mutually exclusive options rendered as prose, not as a
 * control with a box around it.
 *
 * @remarks
 *   ( By Gov't / By Employer )
 *
 * For forms that transcribe a paper document, where the choice is part of a sentence the
 * reader is scanning left to right. The chosen option is emphasised and the others recede;
 * nothing is struck through, because struck-out text that is still clickable reads as
 * disabled.
 *
 * NOT oct-tabs, which is a full-width `block w-full` pill bar using role="tablist". Tabs
 * switch a visible panel; this picks a value, and announcing it as a tab tells a screen
 * reader user that content is about to change when it is not.
 *
 * NOT oct-select, whose border, background and chevron trebles the height of a line and
 * turns a sentence back into a form.
 *
 * Keyboard and screen-reader behaviour comes from real radio inputs, visually hidden under
 * the labels: arrow keys move within the group, Tab moves past it, and the group announces
 * as a radio group with its selected option.
 */
@Component({
  selector: 'oct-ichoice',
  templateUrl: './ichoice.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex items-center gap-1',
    role: 'radiogroup',
    '[attr.aria-label]': 'ariaLabel()'
  }
})
export class IChoiceComponent {
  /** The options, in reading order. Each one has a value and a label. */
  readonly options = input.required<IChoiceOption[]>();

  /** The selected option's value. Undefined means nothing chosen yet, which is a valid state. */
  readonly value = model<string | undefined>(undefined);

  /** Names the group for screen readers: the question the choice answers. */
  readonly ariaLabel = input<string>();

  /** Wrap the options in "( )", as the paper form prints them. */
  readonly brackets = input<boolean>(true);

  /** Stops the user from changing the choice. The chosen option stays emphasised. */
  readonly disabled = input<boolean>(false);

  /**
   * Radio `name`, which MUST be unique per group on the page: two groups sharing a name are
   * one group to the browser, so choosing in either would clear the other. Generated unless
   * the caller pins it, matching how oct-checkbox derives its id.
   */
  readonly name = input<string>();

  private readonly uniqueName = `ichoice-${Math.random().toString(36).substring(2, 11)}`;

  readonly groupName = computed(() => this.name() || this.uniqueName);

  readonly isSelected = (optionValue: string): boolean => this.value() === optionValue;

  readonly select = (optionValue: string): void => {
    if (this.disabled()) return;
    this.value.set(optionValue);
  };
}
