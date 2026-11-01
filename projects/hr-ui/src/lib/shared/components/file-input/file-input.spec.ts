import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { FileInputComponent } from './file-input';

/** Picks one file in preview mode and reports whether the type check let it through. */
function pick(accept: string, file: File): { accepted: boolean; error: string | null } {
  const fixture = TestBed.createComponent(FileInputComponent);
  fixture.componentRef.setInput('accept', accept);
  fixture.detectChanges();

  let accepted = false;
  let error: string | null = null;
  fixture.componentInstance.filesSelected.subscribe(() => (accepted = true));
  fixture.componentInstance.validationError.subscribe(message => (error = message));

  fixture.componentInstance.onFileSelected({ target: { files: [file], value: 'C:\\fakepath\\file' } } as unknown as Event);
  return { accepted, error };
}

const file = (name: string, type: string) => new File(['x'], name, { type });

describe('FileInputComponent accept', () => {
  it('takes a MIME wildcard, such as image/*', () => {
    expect(pick('image/*', file('logo.png', 'image/png')).accepted).toBe(true);
    expect(pick('image/*', file('logo.svg', 'image/svg+xml')).accepted).toBe(true);
  });

  it('takes an extension, such as .pdf, in any letter case', () => {
    expect(pick('.pdf', file('payslip.PDF', 'application/pdf')).accepted).toBe(true);
  });

  it('takes an extension even when the browser reports no MIME type', () => {
    expect(pick('.csv', file('timesheet.csv', '')).accepted).toBe(true);
  });

  it('still takes an exact MIME type', () => {
    expect(pick('image/png, image/jpeg', file('photo.jpg', 'image/jpeg')).accepted).toBe(true);
  });

  it('rejects a file that matches no entry, with the invalid type message', () => {
    expect(pick('image/*,.pdf', file('contract.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'))).toEqual({
      accepted: false,
      error: 'Invalid file type'
    });
  });

  it('does not let a wildcard match another type that only starts the same', () => {
    expect(pick('image/*', file('clip.mp4', 'video/mp4')).accepted).toBe(false);
  });
});

describe('FileInputComponent remove button', () => {
  it('names the real button, not the oct-button around it', () => {
    const fixture = TestBed.createComponent(FileInputComponent);
    fixture.componentRef.setInput('preview', 'data:image/png;base64,iVBORw0KGgo=');
    fixture.componentRef.setInput('labels', { removeButtonAriaLabel: 'Remove logo' });
    fixture.detectChanges();

    const remove = fixture.nativeElement.querySelector('oct-button[color="error"]') as HTMLElement;
    expect(remove.querySelector('button')!.getAttribute('aria-label')).toBe('Remove logo');
    expect(remove.hasAttribute('aria-label')).toBe(false);
  });
});
