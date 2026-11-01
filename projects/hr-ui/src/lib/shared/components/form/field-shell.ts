/**
 * The bordered box a form control sits in, as pure functions.
 *
 * Extracted from oct-input so oct-input-select can put TWO controls inside ONE box and have it
 * look identical to a single field beside it in the same grid. Pure on purpose: the shell is a
 * string of classes, and a function is testable without a TestBed.
 */

export type FieldSize = 'sm' | 'md' | 'lg';

export interface FieldShellState {
  hasError: boolean;
  isDisabled: boolean;
  /** A child is drawing its own ring. See fieldShellClass. */
  suppressFocusRing?: boolean;
}

/** Vertical rhythm for label / control / helper. Every field in a form grid shares it. */
export const fieldContainerClass = (isDisabled: boolean): string =>
  ['relative', 'w-full', 'grid', 'gap-1.5', isDisabled ? 'cursor-not-allowed' : ''].filter(Boolean).join(' ');

export const fieldLabelClass = (hasError: boolean): string =>
  ['inline-flex', 'text-sm', 'font-medium', 'transition-colors', hasError ? 'text-error' : 'text-1'].join(' ');

export const fieldHelperTextClass = (hasError: boolean): string => ['text-sm', hasError ? 'text-error' : 'text-gray-500'].join(' ');

/**
 * The box itself: border, radius, and the focus ring.
 *
 * `focus-within` rather than `focus` is what lets one ring cover both halves of a composed
 * control, so tabbing from the amount to the unit does not flash two separate rings.
 *
 * `suppressFocusRing` hands the ring to a child for as long as that child is focused. The unit
 * half of oct-input-select takes it, because focus-within cannot say WHICH half has the keyboard.
 * Both rings at once stack into one 5px band down the right edge — shell outline, border, then
 * the child's inset outline — so only one may be lit.
 */
export const fieldShellClass = ({ hasError, isDisabled, suppressFocusRing = false }: FieldShellState): string => {
  const base = [
    'flex',
    'items-center',
    'rounded-lg',
    'overflow-hidden',
    'border',
    'border-primary',
    'transition-[border-color,outline-color,outline-width]',
    'ease-out',
    'duration-100',
    'hover:duration-200',
    'focus-within:duration-200',
    'hover:border-primary-600',
    ...(suppressFocusRing ? [] : ['focus-within:!outline', 'focus-within:!outline-2', 'focus-within:!outline-primary']),
    'outline-transparent'
  ];

  if (hasError) {
    base.push('!border-transparent', 'outline-2', '!outline-red-500', 'focus-within:!outline-red-500');
  } else if (isDisabled) {
    base.push('border-neutral-800', 'bg-neutral-900', 'cursor-not-allowed');
  } else {
    base.push('bg-secondary');
  }

  return base.join(' ');
};

/** Padding for an adornment slot. Icons get a square-ish box, text gets tighter horizontal room. */
export const fieldAdornmentClass = (size: FieldSize, isIcon: boolean): string => {
  if (isIcon) {
    switch (size) {
      case 'sm':
        return 'min-w-8 p-2';
      case 'lg':
        return 'min-w-10 p-3';
      default:
        return 'min-w-9 p-2.5';
    }
  }
  switch (size) {
    case 'sm':
      return 'min-w-8 py-1.5 px-2';
    case 'lg':
      return 'min-w-10 py-2.5 px-3';
    default:
      return 'min-w-9 py-2 px-2.5';
  }
};

export const fieldTextPaddingClass = (size: FieldSize): string => {
  switch (size) {
    case 'sm':
      return 'py-1.5 px-2';
    case 'lg':
      return 'py-2.5 px-3';
    default:
      return 'py-2 px-2.5';
  }
};

/** A divider between two controls sharing one shell. A border, never a shadow — a black-alpha
 * shadow is invisible on the dark surface, and this seam carries meaning. */
export const fieldDividerClass = 'self-stretch border-l border-primary';

/**
 * A value nobody can edit, on the line the field beside it puts its value on.
 *
 * Read-only text in a form grid has no shell, so without this it sits wherever the row's height
 * leaves it. The transparent border stands in for the shell's 1px and the padding is the control's
 * own, which is what puts the two texts on one line while keeping this one plainly not a field.
 */
export const fieldReadonlyValueClass = (size: FieldSize): string => {
  switch (size) {
    case 'sm':
      return 'border-y border-transparent py-1.5';
    case 'lg':
      return 'border-y border-transparent py-2.5';
    default:
      return 'border-y border-transparent py-2';
  }
};
