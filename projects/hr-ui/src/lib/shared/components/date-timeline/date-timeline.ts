import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DateService } from '../../../services/general/date.service';
import { TextComponent } from '../text/text';

/** One milestone on the strip. Nodes without a date are omitted entirely. */
export interface DateTimelineNode {
  /** Rendered as dd MMM (years live on the year markers); a falsy value drops
   *  the node from the strip. */
  date: string | Date | null | undefined;
  /** Highlighted node: accent-colored dot and date; the track from this node
   *  to the end of the span is drawn in the accent color as well. */
  emphasis?: boolean;
}

type LabelSide = 'above' | 'below';

interface PositionedDateTimelineNode {
  node: DateTimelineNode;
  /** Dot position along the track, 0-100, proportional to the date span. */
  percent: number;
  /** Date-label position, 0-100: equals `percent` unless same-side labels had to spread. */
  labelPercent: number;
  /** Dates sit below the track; colliding neighbours alternate above/below. */
  side: LabelSide;
  /** Pre-formatted date text, so the template does a pure property read. */
  label: string;
}

interface YearMarker {
  year: number;
  /** Label position, 0-100: the middle of this year's own stretch of track. */
  labelPercent: number;
  /** Position of this year's 1 Jan, 0-100, or null for the span's first year,
   *  whose stretch opens at the span start where the earliest dot already sits. */
  tickPercent: number | null;
}

interface LabelCluster {
  items: PositionedDateTimelineNode[];
  sum: number;
}

/**
 * Minimal horizontal date timeline: proportionally placed dots with their
 * dates, nothing else. The stretch of track after an emphasized node is drawn
 * in the accent color so the effective interval reads at a glance, and every
 * year the span touches is labelled above its own stretch. Dates of
 * near-coincident nodes alternate above/below the track instead of
 * overlapping. Renders nothing when no node has a date.
 */
@Component({
  selector: 'oct-date-timeline',
  templateUrl: './date-timeline.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
  imports: [TextComponent]
})
export class DateTimelineComponent {
  /** Two dates on the same side closer than this (% of the span) collide.
   *  Tuned for the short dd MMM labels. */
  private static readonly LABEL_GAP_PERCENT = 10;

  /** Height of the year-label row that sits between the dates and the track. */
  private static readonly YEAR_ROW_HEIGHT = 20;

  private readonly dateService = inject(DateService);

  readonly nodes = input.required<DateTimelineNode[]>();

  /** 'center' (default) centers each date under its dot and pads both sides to
   *  fit the edge labels. 'start' aligns each date's left edge to its dot, so
   *  the strip needs no left padding and lines up flush with adjacent content. */
  readonly labelAlign = input<'center' | 'start'>('center');

  // Unparseable dates are dropped along with empty ones: a single NaN
  // timestamp would poison the span math for every other node.
  readonly visibleNodes = computed(() => this.nodes().filter(node => !!node.date && this.dateService.isValid(node.date)));

  private readonly times = computed(() => this.visibleNodes().map(node => this.dateService.toTimestamp(node.date as string | Date)));

  readonly positionedNodes = computed<PositionedDateTimelineNode[]>(() => {
    const nodes = this.visibleNodes();
    if (!nodes.length) {
      return [];
    }
    const times = this.times();
    const min = Math.min(...times);
    const span = Math.max(...times) - min;
    const positioned: PositionedDateTimelineNode[] = nodes.map((node, i) => {
      const percent = span === 0 ? 50 : ((times[i] - min) / span) * 100;
      return { node, percent, labelPercent: percent, side: 'below' as LabelSide, label: this.formatDate(node.date) };
    });

    // Colliding neighbours alternate below/above the track; if one side of a
    // dense cluster still collides, its dates spread horizontally as well.
    const gap = DateTimelineComponent.LABEL_GAP_PERCENT;
    const sorted = [...positioned].sort((a, b) => a.percent - b.percent);
    let clusterStart = 0;
    for (let i = 1; i <= sorted.length; i++) {
      if (i === sorted.length || sorted[i].percent - sorted[i - 1].percent >= gap) {
        sorted.slice(clusterStart, i).forEach((item, offset) => {
          item.side = offset % 2 === 0 ? 'below' : 'above';
        });
        clusterStart = i;
      }
    }
    this.spreadLabels(sorted.filter(item => item.side === 'below'));
    this.spreadLabels(sorted.filter(item => item.side === 'above'));
    return positioned;
  });

  /** The accent-colored stretch of track: from the emphasized node to the end of the span. */
  readonly emphasisSegment = computed<{ left: number; width: number } | null>(() => {
    const positioned = this.positionedNodes();
    const emphasized = positioned.filter(item => item.node.emphasis);
    if (!emphasized.length) {
      return null;
    }
    const left = Math.min(...emphasized.map(item => item.percent));
    const right = Math.max(...positioned.map(item => item.percent));
    return right > left ? { left, width: right - left } : null;
  });

  /**
   * Resolves date-label collisions within one side: colliding neighbours merge
   * into a cluster whose labels are laid out GAP apart, centered on the
   * cluster's dots and clamped to the track (pool-adjacent-violators style).
   */
  private spreadLabels(sortedItems: PositionedDateTimelineNode[]): void {
    const gap = DateTimelineComponent.LABEL_GAP_PERCENT;
    const clusters: LabelCluster[] = [];

    const start = (c: LabelCluster): number => {
      const center = c.sum / c.items.length;
      const width = (c.items.length - 1) * gap;
      return Math.min(Math.max(center - width / 2, 0), 100 - width);
    };
    const end = (c: LabelCluster): number => start(c) + (c.items.length - 1) * gap;

    for (const item of sortedItems) {
      clusters.push({ items: [item], sum: item.percent });
      while (clusters.length > 1 && start(clusters[clusters.length - 1]) < end(clusters[clusters.length - 2]) + gap) {
        const merged = clusters.pop()!;
        const previous = clusters[clusters.length - 1];
        previous.items.push(...merged.items);
        previous.sum += merged.sum;
      }
    }

    for (const cluster of clusters) {
      cluster.items.forEach((item, i) => {
        item.labelPercent = start(cluster) + i * gap;
      });
    }
  }

  /**
   * One marker per year the span touches, so the year is readable even when
   * every date shares it and the short dd MMM labels never name it. Each label
   * is centered over its own stretch of track, which keeps neighbouring years
   * apart however lopsided the split is; a year that opens on a 1 Jan inside
   * the span also gets a tick on it.
   */
  readonly yearMarkers = computed<YearMarker[]>(() => {
    const times = this.times();
    if (!times.length) {
      return [];
    }
    const min = Math.min(...times);
    const max = Math.max(...times);
    const span = max - min;
    // Node dates parse as UTC midnights ('YYYY-MM-DD' strings and the Dates
    // derived from them), so year boundaries must be UTC too or the ticks
    // drift relative to the dots in non-UTC browser timezones.
    const firstYear = new Date(min).getUTCFullYear();
    const lastYear = new Date(max).getUTCFullYear();
    const percentOf = (time: number): number => (span === 0 ? 50 : ((time - min) / span) * 100);

    const markers: YearMarker[] = [];
    for (let year = firstYear; year <= lastYear; year++) {
      const opens = year === firstYear ? min : Date.UTC(year, 0, 1);
      const closes = year === lastYear ? max : Date.UTC(year + 1, 0, 1);
      markers.push({
        year,
        labelPercent: (percentOf(opens) + percentOf(closes)) / 2,
        tickPercent: year === firstYear ? null : percentOf(opens)
      });
    }
    return markers;
  });

  // Vertical layout in px, measured from the top of the strip. Space above the
  // track exists only when needed (flipped dates); the year row is always
  // there, since every rendered strip carries at least one year marker.
  private blockHeight(side: LabelSide): number {
    return this.positionedNodes().some(item => item.side === side) ? 24 : 0;
  }
  readonly aboveHeight = computed(() => this.blockHeight('above'));
  readonly trackTop = computed(() => (this.aboveHeight() ? this.aboveHeight() + 10 : 0) + DateTimelineComponent.YEAR_ROW_HEIGHT + 6);
  readonly yearLabelTop = computed(() => this.trackTop() - 24);
  // Flipped dates anchor above the year row so they never overlap a year label
  // sitting between them and the track.
  readonly aboveTextTop = computed(() => this.trackTop() - 12 - DateTimelineComponent.YEAR_ROW_HEIGHT);
  readonly textTop = computed(() => this.trackTop() + 12);
  readonly containerHeight = computed(() => this.textTop() + this.blockHeight('below'));

  formatDate(date: string | Date | null | undefined): string {
    // Day + month only: the year lives on the year-boundary ticks, keeping the
    // strip labels short.
    return this.dateService.format(date, 'dd MMM');
  }
}
