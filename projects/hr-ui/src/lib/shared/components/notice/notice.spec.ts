import { describe, expect, it, vi } from 'vitest';
import { NoticeComponent } from './notice';

describe('NoticeComponent', () => {
  it('emits actionClick when the action button is clicked', () => {
    const emit = vi.fn();
    const context = { actionClick: { emit } };

    NoticeComponent.prototype.onActionClick.call(context as any);

    expect(emit).toHaveBeenCalledTimes(1);
  });
});
