import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'avatar',
  title: 'Avatar',
  description: 'Shows who a person is at a glance: their photo, or their initials when there is no photo.',
  imports: ['AvatarComponent'],
  usage: `<oct-avatar name="Priya Raman" />`,
  examples: [
    { name: 'avatar-demo', compact: true },
    { name: 'avatar-initials', title: 'Initials', description: 'Without src, or when the photo fails to load, the avatar shows the first letters of the first and last words of name. With no name either, it shows a person icon.' },
    { name: 'avatar-sizes', title: 'Sizes', compact: true },
    { name: 'avatar-status', title: 'Status', description: 'A dot on the corner shows whether the person is online, away, busy or offline.', compact: true },
    { name: 'avatar-tooltip', title: 'Name on hover', description: 'showTooltip shows the name under the avatar when the pointer rests on it.', compact: true }
  ],
  accessibility: [
    'The avatar has role="img" and takes its accessible name from alt, then name, then "User avatar". A status is added to the name, as in "Nurul Aisyah, online", so the dot itself is hidden from screen readers.',
    'When the name is already written beside the avatar, add aria-hidden="true" to the avatar so screen readers do not read the name twice.',
    'clickable draws the avatar as a native <button> with the same name, so it takes focus and Enter and Space click it. Listen to (click) on oct-avatar.'
  ],
  api: ['AvatarComponent']
};
