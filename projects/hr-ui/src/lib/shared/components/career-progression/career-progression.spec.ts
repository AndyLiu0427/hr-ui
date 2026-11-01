import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentRef, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CareerProgressionComponent, CareerProgressionContract } from './career-progression';

const contract = (overrides: Partial<CareerProgressionContract> = {}): CareerProgressionContract => ({
  id: 'c-1',
  startDate: '2024-01-01',
  endDate: '2024-06-30',
  clients: [
    {
      name: 'Client A',
      assignments: [{ id: 'a-1', department: 'DEPT_A', jobTitle: 'Crew', startDate: '2024-01-01', endDate: '2024-06-30' }]
    }
  ],
  ...overrides
});

describe('CareerProgressionComponent', () => {
  let fixture: ComponentFixture<CareerProgressionComponent>;
  let ref: ComponentRef<CareerProgressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerProgressionComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(CareerProgressionComponent);
    ref = fixture.componentRef;
  });

  const text = (): string => (fixture.nativeElement.textContent ?? '').replace(/\s+/g, ' ').trim();

  const leafText = (): string[] =>
    Array.from(fixture.nativeElement.querySelectorAll('button')).map(el => ((el as HTMLElement).textContent ?? '').replace(/\s+/g, ' ').trim());

  const nodeClasses = (): string[] => Array.from(fixture.nativeElement.querySelectorAll('li > div > span')).map(el => (el as HTMLElement).className);

  it('shows the empty state when there are no contracts', async () => {
    ref.setInput('contracts', []);
    ref.setInput('config', { emptyMessage: 'Nothing here' });
    await fixture.whenStable();

    expect(text()).toContain('Nothing here');
  });

  it('renders contract dates, client name, and the assignment leaf', async () => {
    ref.setInput('contracts', [contract()]);
    await fixture.whenStable();

    expect(text()).toContain('01 Jan 2024 - 30 Jun 2024');
    expect(text()).toContain('Client A');
    expect(leafText()[0]).toContain('DEPT_A');
    expect(leafText()[0]).toContain('Crew');
  });

  it('reads an absent contract end date as Present', async () => {
    ref.setInput('contracts', [contract({ endDate: undefined })]);
    await fixture.whenStable();

    expect(text()).toContain('01 Jan 2024 - Present');
  });

  it('leaves out the job title when the assignment has none', async () => {
    ref.setInput('contracts', [
      contract({
        clients: [{ name: 'Client A', assignments: [{ id: 'a-1', department: 'DEPT_A', startDate: '2024-01-01', endDate: '2024-06-30' }] }]
      })
    ]);
    await fixture.whenStable();

    expect(leafText()[0]).toContain('DEPT_A');
    expect(leafText()[0]).not.toContain('Crew');
  });

  it('gives one contract a branch per client', async () => {
    ref.setInput('contracts', [
      contract({
        clients: [
          { name: 'Client A', assignments: [{ id: 'a-1', department: 'DEPT_A', startDate: '2024-01-01', endDate: '2024-03-31' }] },
          { name: 'Client B', assignments: [{ id: 'a-2', department: 'DEPT_B', startDate: '2024-04-01', endDate: '2024-06-30' }] }
        ]
      })
    ]);
    await fixture.whenStable();

    expect(text()).toContain('Client A');
    expect(text()).toContain('Client B');
    expect(leafText()).toHaveLength(2);
  });

  it('greens the top node only while its contract has not ended', async () => {
    ref.setInput('contracts', [contract({ id: 'c-2', endDate: undefined }), contract({ id: 'c-1' })]);
    await fixture.whenStable();

    const classes = nodeClasses();
    expect(classes[0]).toContain('bg-green-500');
    expect(classes[1]).not.toContain('bg-green-500');
  });

  it('greens nothing once the top contract has ended', async () => {
    ref.setInput('contracts', [contract({ id: 'c-2', endDate: '2024-06-30' })]);
    await fixture.whenStable();

    expect(nodeClasses()[0]).not.toContain('bg-green-500');
  });

  it('emits the assignment behind the leaf that was clicked', async () => {
    ref.setInput('contracts', [contract()]);
    await fixture.whenStable();

    let emitted: string | undefined;
    fixture.componentInstance.assignmentClick.subscribe(assignment => (emitted = assignment.id));
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    expect(emitted).toBe('a-1');
  });
});
