import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { CardComponent, CardContentComponent } from 'ngx-hr-ui';
import { CheckboxComponent } from 'ngx-hr-ui';
import { DateTimelineComponent, DateTimelineNode } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';

@Component({
  selector: 'oct-date-timeline-page',
  templateUrl: './date-timeline.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, CardContentComponent, CheckboxComponent, DateTimelineComponent, TextComponent]
})
export class DateTimelinePageComponent {
  readonly hasStart = signal(true);
  readonly hasEffective = signal(true);
  readonly hasEnd = signal(true);

  // Crosses a year boundary on purpose so the playground shows the year tick.
  readonly playgroundNodes = computed<DateTimelineNode[]>(() => [
    { date: this.hasStart() ? '2025-12-04' : null },
    { date: this.hasEffective() ? '2026-03-16' : null, emphasis: true },
    { date: this.hasEnd() ? '2026-09-03' : null }
  ]);

  readonly getDisplayCode = computed(() => {
    const nodes = this.playgroundNodes().filter(node => !!node.date);
    const lines = nodes.map(node => {
      const parts = [`date: '${node.date}'`];
      if (node.emphasis) parts.push('emphasis: true');
      return `  { ${parts.join(', ')} }`;
    });
    return `<oct-date-timeline [nodes]="nodes" />\n\nnodes: DateTimelineNode[] = [\n${lines.join(',\n')}\n];`;
  });

  readonly examples: Array<{ title: string; description: string; nodes: DateTimelineNode[] }> = [
    {
      title: 'Assignment period with an effective date',
      description:
        'The accent dot marks the effective date, and the track from there to the end is drawn in the accent color: the effective interval reads at a glance.',
      nodes: [{ date: '2025-12-04' }, { date: '2026-03-16', emphasis: true }, { date: '2026-09-03' }]
    },
    {
      title: 'Plain date range',
      description: 'Nodes without a date are omitted, so an unset effective date collapses the strip to two milestones.',
      nodes: [{ date: '2026-01-15' }, { date: null, emphasis: true }, { date: '2026-12-31' }]
    },
    {
      title: 'Start and effective on the same day',
      description: 'Same-day dates share one dot position; their dates split above and below the track.',
      nodes: [{ date: '2026-01-15' }, { date: '2026-01-15', emphasis: true }, { date: '2026-12-31' }]
    }
  ];
}
