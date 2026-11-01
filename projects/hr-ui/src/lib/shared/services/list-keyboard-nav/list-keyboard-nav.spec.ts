import { beforeEach, describe, expect, it } from 'vitest';
import { ListKeyboardNav, NavItem } from './list-keyboard-nav';

interface Opt extends NavItem {
  label: string;
}

const opts = (...labels: { label: string; disabled?: boolean }[]): Opt[] => labels;

describe('ListKeyboardNav', () => {
  let nav: ListKeyboardNav<Opt>;

  beforeEach(() => {
    nav = new ListKeyboardNav<Opt>();
  });

  describe('setOptions', () => {
    it('highlights the first enabled option by default', () => {
      nav.setOptions(opts({ label: 'a' }, { label: 'b' }));
      expect(nav.activeIndex()).toBe(0);
    });

    it('skips a leading disabled option when picking the first', () => {
      nav.setOptions(opts({ label: 'a', disabled: true }, { label: 'b' }));
      expect(nav.activeIndex()).toBe(1);
    });

    it('sets activeIndex to -1 for an empty list', () => {
      nav.setOptions([]);
      expect(nav.activeIndex()).toBe(-1);
    });

    it('sets activeIndex to -1 when every option is disabled', () => {
      nav.setOptions(opts({ label: 'a', disabled: true }, { label: 'b', disabled: true }));
      expect(nav.activeIndex()).toBe(-1);
    });

    it('honors a preferredIndex when the option is enabled', () => {
      nav.setOptions(opts({ label: 'a' }, { label: 'b' }, { label: 'c' }), 2);
      expect(nav.activeIndex()).toBe(2);
    });

    it('falls back to first enabled when preferredIndex is disabled', () => {
      nav.setOptions(opts({ label: 'a' }, { label: 'b', disabled: true }), 1);
      expect(nav.activeIndex()).toBe(0);
    });

    it('falls back to first enabled when preferredIndex is out of range', () => {
      nav.setOptions(opts({ label: 'a' }, { label: 'b' }), 9);
      expect(nav.activeIndex()).toBe(0);
    });
  });

  describe('move', () => {
    beforeEach(() => nav.setOptions(opts({ label: 'a' }, { label: 'b' }, { label: 'c' })));

    it('advances to the next option', () => {
      nav.move(1);
      expect(nav.activeIndex()).toBe(1);
    });

    it('goes to the previous option', () => {
      nav.move(1);
      nav.move(-1);
      expect(nav.activeIndex()).toBe(0);
    });

    it('wraps from last to first by default', () => {
      nav.setOptions(opts({ label: 'a' }, { label: 'b' }));
      nav.move(1); // -> 1
      nav.move(1); // wraps -> 0
      expect(nav.activeIndex()).toBe(0);
    });

    it('wraps from first to last when moving up', () => {
      nav.setOptions(opts({ label: 'a' }, { label: 'b' }));
      nav.move(-1);
      expect(nav.activeIndex()).toBe(1);
    });

    it('clamps at the ends when wrap is false', () => {
      nav.setOptions(opts({ label: 'a' }, { label: 'b' }));
      nav.move(-1, { wrap: false });
      expect(nav.activeIndex()).toBe(0);
      nav.move(1);
      nav.move(1, { wrap: false });
      expect(nav.activeIndex()).toBe(1);
    });

    it('skips disabled options while moving', () => {
      nav.setOptions(opts({ label: 'a' }, { label: 'b', disabled: true }, { label: 'c' }));
      nav.move(1); // from 0, skip disabled 1 -> 2
      expect(nav.activeIndex()).toBe(2);
    });

    it('does nothing on an empty list', () => {
      nav.setOptions([]);
      nav.move(1);
      expect(nav.activeIndex()).toBe(-1);
    });
  });

  describe('setActive (hover)', () => {
    beforeEach(() => nav.setOptions(opts({ label: 'a' }, { label: 'b' }, { label: 'c' })));

    it('sets the active index to an in-range option', () => {
      nav.setActive(2);
      expect(nav.activeIndex()).toBe(2);
    });

    it('ignores an out-of-range index', () => {
      nav.setActive(9);
      expect(nav.activeIndex()).toBe(0);
      nav.setActive(-5);
      expect(nav.activeIndex()).toBe(0);
    });
  });

  describe('clearActive', () => {
    it('drops the highlight to -1 but keeps the options for later moves', () => {
      nav.setOptions(opts({ label: 'a' }, { label: 'b' }));
      nav.clearActive();
      expect(nav.activeIndex()).toBe(-1);
      nav.move(1); // options still present → moves to first
      expect(nav.activeIndex()).toBe(0);
    });
  });

  describe('first / last (Home / End)', () => {
    beforeEach(() => nav.setOptions(opts({ label: 'a', disabled: true }, { label: 'b' }, { label: 'c' }, { label: 'd', disabled: true })));

    it('first() highlights the first enabled option', () => {
      nav.move(1);
      nav.first();
      expect(nav.activeIndex()).toBe(1);
    });

    it('last() highlights the last enabled option', () => {
      nav.last();
      expect(nav.activeIndex()).toBe(2);
    });
  });
});
