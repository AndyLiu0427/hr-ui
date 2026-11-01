import { beforeEach, describe, expect, it } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateTimelineComponent, DateTimelineNode } from './date-timeline';

describe('DateTimelineComponent', () => {
  let fixture: ComponentFixture<DateTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateTimelineComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(DateTimelineComponent);
  });

  const setNodes = async (nodes: DateTimelineNode[]): Promise<void> => {
    fixture.componentRef.setInput('nodes', nodes);
    await fixture.whenStable();
  };

  const text = (): string => (fixture.nativeElement.textContent ?? '').trim();

  it('renders each dated node as dd MMM, leaving the year to the markers', async () => {
    await setNodes([{ date: '2026-01-15' }, { date: '2026-12-31' }]);

    expect(fixture.componentInstance.positionedNodes().map(p => p.label)).toEqual(['15 Jan', '31 Dec']);
  });

  it('omits nodes without a date', async () => {
    await setNodes([{ date: '2026-01-15' }, { date: '', emphasis: true }, { date: '2026-12-31' }]);

    expect(fixture.componentInstance.positionedNodes()).toHaveLength(2);
  });

  it('drops unparseable dates instead of letting NaN poison the span math', async () => {
    await setNodes([{ date: '2026-01-15' }, { date: 'not-a-date', emphasis: true }, { date: '2026-12-31' }]);

    const positioned = fixture.componentInstance.positionedNodes();
    expect(positioned).toHaveLength(2);
    expect(positioned.every(p => Number.isFinite(p.percent))).toBe(true);
  });

  it('renders nothing at all when no node has a date', async () => {
    await setNodes([{ date: null }, { date: undefined }]);

    expect(fixture.nativeElement.querySelector('div')).toBeNull();
  });

  it('highlights the emphasized node and colors the track from it to the end of the span', async () => {
    await setNodes([{ date: '2026-01-15' }, { date: '2026-03-15', emphasis: true }, { date: '2026-12-31' }]);

    expect(fixture.nativeElement.querySelectorAll('.text-hr-blue-600').length).toBeGreaterThan(0);
    const segment = fixture.componentInstance.emphasisSegment();
    const positioned = fixture.componentInstance.positionedNodes();
    expect(segment?.left).toBeCloseTo(positioned[1].percent, 5);
    expect((segment?.left ?? 0) + (segment?.width ?? 0)).toBeCloseTo(100, 5);
  });

  it('draws no accent segment without an emphasized node', async () => {
    await setNodes([{ date: '2026-01-15' }, { date: '2026-12-31' }]);

    expect(fixture.componentInstance.emphasisSegment()).toBeNull();
  });

  it('positions dots proportionally to the date distances', async () => {
    await setNodes([{ date: '2026-01-01' }, { date: '2026-01-11' }, { date: '2026-01-21' }]);

    const percents = fixture.componentInstance.positionedNodes().map(p => Math.round(p.percent));
    expect(percents).toEqual([0, 50, 100]);
  });

  it('splits the dates of near-coincident nodes above and below the track', async () => {
    await setNodes([{ date: '2026-01-15' }, { date: '2026-01-15', emphasis: true }, { date: '2026-12-31' }]);

    const positioned = fixture.componentInstance.positionedNodes();
    expect(positioned[0].side).toBe('below');
    expect(positioned[1].side).toBe('above');
    expect(positioned[2].side).toBe('below');
  });

  it('labels both years of a span that crosses a year end, ticking only the 1 Jan', async () => {
    await setNodes([{ date: '2025-12-04' }, { date: '2026-09-03' }]);

    const markers = fixture.componentInstance.yearMarkers();
    expect(markers.map(m => m.year)).toEqual([2025, 2026]);
    // The span opens in early Dec, so 1 Jan sits near the start of the track.
    expect(markers[1].tickPercent).toBeGreaterThan(0);
    expect(markers[1].tickPercent).toBeLessThan(20);
    // The opening year has no boundary of its own to tick.
    expect(markers[0].tickPercent).toBeNull();
    expect(text()).toContain('2025');
    expect(text()).toContain('2026');
  });

  it('labels the year even when the span stays inside it', async () => {
    await setNodes([{ date: '2026-01-15' }, { date: '2026-12-31' }]);

    const markers = fixture.componentInstance.yearMarkers();
    expect(markers).toHaveLength(1);
    expect(markers[0].year).toBe(2026);
    expect(markers[0].labelPercent).toBe(50);
    expect(markers[0].tickPercent).toBeNull();
    expect(text()).toContain('2026');
  });

  it('labels the year when only one node has a date', async () => {
    await setNodes([{ date: '2026-03-20' }, { date: null }]);

    const markers = fixture.componentInstance.yearMarkers();
    expect(markers).toHaveLength(1);
    expect(markers[0].year).toBe(2026);
    expect(markers[0].labelPercent).toBe(50);
    expect(text()).toContain('2026');
  });

  it('centers labels and pads both sides by default', async () => {
    await setNodes([{ date: '2026-01-15' }, { date: '2026-12-31' }]);

    expect(fixture.componentInstance.labelAlign()).toBe('center');
    const wrapper = fixture.nativeElement.querySelector('div');
    expect(wrapper.className).toContain('px-8');
    const label = fixture.nativeElement.querySelector('.whitespace-nowrap');
    expect(label.className).toContain('-translate-x-1/2');
  });

  it('left-aligns labels and drops the left padding when labelAlign is start', async () => {
    fixture.componentRef.setInput('labelAlign', 'start');
    await setNodes([{ date: '2026-01-15' }, { date: '2026-12-31' }]);

    const wrapper = fixture.nativeElement.querySelector('div');
    expect(wrapper.className).not.toContain('px-8');
    expect(wrapper.className).toContain('pr-12');
    const label = fixture.nativeElement.querySelector('.whitespace-nowrap');
    expect(label.className).not.toContain('-translate-x-1/2');
  });

  it('keeps both year labels apart when the span opens days before a year end', async () => {
    await setNodes([{ date: '2025-12-20' }, { date: '2026-12-19' }]);

    const markers = fixture.componentInstance.yearMarkers();
    expect(markers.map(m => m.year)).toEqual([2025, 2026]);
    // 1 Jan lands ~3% along the track, yet centering each label over its own
    // stretch still leaves them half a track apart.
    expect(markers[1].tickPercent).toBeLessThan(5);
    expect(markers[1].labelPercent - markers[0].labelPercent).toBeGreaterThan(45);
  });
});
