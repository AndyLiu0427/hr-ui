import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';


/** The colours a tag can take. A Record over this type below means a new colour needs a fill. */
export const ColorTagColor = {
  Red: 'red',
  Orange: 'orange',
  Yellow: 'yellow',
  Green: 'green',
  Blue: 'blue',
  Purple: 'purple'
} as const;

export type ColorTagColor = (typeof ColorTagColor)[keyof typeof ColorTagColor];

/**
 * How the tag attaches to what it marks, always as the same right triangle.
 *
 * `cut`    takes the corner out of a card it wraps.
 * `corner` pins to the top-left of the table cell it sits in, which is the row's own corner,
 *          so a marked row reads like a marked card.
 * `inline` sits in the text flow, for a select option that has no corner to pin to.
 */
export type ColorTagVariant = 'cut' | 'corner' | 'inline';

/**
 * `-600` sits one step past the pivot of the inverted palettes, so no fill clears 3:1 against
 * its ground. Chosen, not overlooked: the mark only ever accents a label that already names
 * the client.
 */
const FILL_CLASS: Record<ColorTagColor, string> = {
  red: 'bg-red-600',
  orange: 'bg-orange-600',
  yellow: 'bg-yellow-600',
  green: 'bg-green-600',
  blue: 'bg-blue-600',
  purple: 'bg-violet-600'
};

/**
 * A color marker on a card corner or in a row.
 *
 * `null` draws nothing, and that is also how PE's Transparent is stored: filing a client under
 * no color and never filing it are the same state.
 *
 * Six colors cover nine clients, so the mark narrows a row rather than naming it. It is
 * `aria-hidden`, so pass `label` and let this component draw the code beside it.
 */
@Component({
  selector: 'oct-color-tag',
  host: { class: 'contents' },
  template: `
    <div class="oct-tag" [attr.data-variant]="variant()" [attr.data-filled]="color() ? '' : null" [attr.data-labelled]="label() ? '' : null">
      <!-- With a label the mark keeps its box even when the client is unfiled, so a column of
           codes has one straight left edge instead of two. Without one there is nothing to line
           up against, so an unfiled client draws nothing at all. -->
      @if (variant() === 'inline' && (color() || label())) {
        <span class="oct-tag-inline" [class]="fillClass()" aria-hidden="true"></span>
      }

      @if (variant() === 'corner' && color()) {
        <span class="oct-tag-corner" [class]="fillClass()" aria-hidden="true"></span>
      }

      <!-- Painted before the content so the content's clipped diagonal lands on top of it,
           leaving no seam where the two meet. -->
      @if (variant() === 'cut' && color()) {
        <span class="oct-tag-wedge" [class]="fillClass()" aria-hidden="true"></span>
      }

      @if (label()) {
        <span class="oct-tag-label">{{ label() }}</span>
      }

      <!-- Projected content belongs to the caller's view and carries the caller's style
           scope, so cut cannot clip it directly. This wrapper is ours, so it can. -->
      <div class="oct-tag-content">
        <ng-content />
      </div>
    </div>
  `,
  styles: [
    `
      .oct-tag {
        position: relative;
      }

      /* inline puts the tag in the caller's own text flow, so neither wrapper may become a
         box of its own: a table cell keeps its padding and its single line. */
      .oct-tag[data-variant='inline']:not([data-labelled]),
      .oct-tag[data-variant='inline'] > .oct-tag-content {
        display: contents;
      }

      /* corner leaves the label in the cell's normal flow and lifts the mark out of it, up to
         the cell's own top-left. Deliberately NOT position:relative: the mark anchors to the
         cell (see td.oct-corner-tag-cell in styles.css), and a containing block here would pin
         it to the text instead, which <td> centres vertically. Nothing reserves space, so an
         unfiled client needs no placeholder and the column still lines up.

         overflow-hidden on the cell clips at the padding box, so a mark on that corner
         survives it. */
      .oct-tag[data-variant='corner'] {
        /* static, undoing .oct-tag's own relative: the mark has to anchor to the CELL (see
           td.oct-corner-tag-cell in styles.css). Leave this positioned and it anchors here
           instead, which is the text box, and <td> centres that vertically. */
        position: static;
        display: block;
        min-width: 0;
      }

      .oct-tag-corner {
        position: absolute;
        top: 0;
        left: 0;
        width: 14px;
        height: 14px;
        clip-path: polygon(0 0, 100% 0, 0 100%);
      }

      /* Given a label the component lays out the row itself, so the four tables that pair a
         mark with a code stopped repeating the same wrapper. */
      .oct-tag[data-variant='inline'][data-labelled] {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 0;
        max-width: 100%;
      }

      /* The label truncates itself rather than leaning on the cell. oct-table withholds
         overflow-hidden and text-ellipsis from a FIXED column, so a long value there would
         otherwise run straight over the next one. */
      .oct-tag-label {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* An inline span ignores overflow, so corner's label needs a box of its own. Under
         inline the flex container already gives it one. */
      .oct-tag[data-variant='corner'] .oct-tag-label {
        display: block;
      }

      /* cut takes the corner out of the content and drops a wedge into the hole. Filling the
         whole shell instead would put color under every edge of the content, and the
         content's antialiased border would let a hairline of it through all the way round.
         The clip runs ahead of the wrapped box's border and shadow, so the cut corner of a
         bordered card renders flat. */
      .oct-tag[data-variant='cut'][data-filled] > .oct-tag-content {
        clip-path: polygon(24px 0, 100% 0, 100% 100%, 0 100%, 0 24px);
      }

      /* Two pixels past the hole, so the content's diagonal overlaps it rather than meeting
         it edge to edge and leaving a seam of page behind. */
      .oct-tag-wedge {
        position: absolute;
        top: 0;
        left: 0;
        width: 26px;
        height: 26px;
        clip-path: polygon(0 0, 100% 0, 0 100%);
      }

      /* Same right triangle as the wedge, so a row and a card read as the same mark. A circle
         here read as a status badge, which is what every other dot in this product means.

         11px, not the circle's 10: a right triangle covers half its box, so at equal size it
         carries visibly less weight than the circle it replaces.

         Nudged down 1px because its mass sits in the top-left corner, so a box centred on the
         text baseline looks high. Optical, not geometric. */
      .oct-tag-inline {
        position: relative;
        top: 1px;
        display: inline-block;
        flex: none;
        width: 11px;
        height: 11px;
        clip-path: polygon(0 0, 100% 0, 0 100%);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorTagComponent {
  readonly color = input<ColorTagColor | null>(null);
  readonly variant = input<ColorTagVariant>('inline');

  /**
   * The text the mark sits beside, usually the client code. Six colours cover nine clients, so
   * the mark narrows the row and the label is what names it; passing it here rather than beside
   * the component is what stops a caller shipping a colour with nothing to read it by.
   */
  readonly label = input<string | null>(null);

  readonly fillClass = computed(() => {
    const color = this.color();
    return color ? FILL_CLASS[color] : '';
  });
}
