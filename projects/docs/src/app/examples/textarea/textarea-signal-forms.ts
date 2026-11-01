import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { ButtonComponent, TextareaComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-textarea-signal-forms',
  imports: [FormRoot, FormField, TextareaComponent, ButtonComponent],
  host: { class: 'block w-full max-w-md' },
  template: `
    <form [formRoot]="reviewForm" class="flex flex-col gap-2">
      <oct-textarea
        label="Feedback for Kenji Watanabe"
        placeholder="What went well this quarter, and what to focus on next."
        [formField]="reviewForm.feedback"
      />
      <div class="flex items-center gap-3">
        <oct-button type="submit">Submit review</oct-button>
        @if (submitted()) {
          <span class="text-sm text-2">Review sent to Kenji.</span>
        }
      </div>
    </form>
  `
})
export default class TextareaSignalForms {
  readonly review = signal({ feedback: '' });
  readonly submitted = signal(false);

  readonly reviewForm = form(
    this.review,
    path => {
      required(path.feedback, { message: 'Write some feedback before you submit.' });
      minLength(path.feedback, 40, { message: 'Write at least 40 characters, so the feedback is useful.' });
    },
    { submission: { action: async () => this.submitted.set(true) } }
  );
}
