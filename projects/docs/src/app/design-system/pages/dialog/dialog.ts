import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogComponent, DialogHeaderComponent, DialogContentComponent, DialogFooterComponent } from 'hr-ui';
import { ButtonComponent } from 'hr-ui';
import { CardComponent, CardContentComponent } from 'hr-ui';
import { CheckboxComponent } from 'hr-ui';
import { InputComponent } from 'hr-ui';
import { TextComponent } from 'hr-ui';
import { PopupService } from 'hr-ui';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'oct-dialog-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    DialogComponent,
    DialogHeaderComponent,
    DialogContentComponent,
    DialogFooterComponent,
    ButtonComponent,
    TextComponent,
    InputComponent,
    CheckboxComponent,
    CardComponent,
    CardContentComponent
  ],
  templateUrl: './dialog.html'
})
export class DialogPageComponent {
  readonly popupService = inject(PopupService);
  readonly translate = inject(TranslateService);

  // Manual dialog state
  isDialogOpen = signal(false);
  dialogTitle = signal('Edit Profile');
  dialogContent = signal("Make changes to your profile here. Click save when you're done.");
  showFormExample = signal(false);

  // Form data for example
  formData = signal({
    name: '',
    email: '',
    phone: ''
  });

  // PopupService demo methods
  async showSuccess(): Promise<void> {
    await this.popupService.success('Operation completed successfully!');
  }

  async showError(): Promise<void> {
    await this.popupService.error('Something went wrong. Please try again.');
  }

  async showWarning(): Promise<void> {
    await this.popupService.warning('This action cannot be undone.');
  }

  async showInfo(): Promise<void> {
    await this.popupService.info('System maintenance scheduled for tonight.');
  }

  async showConfirmDelete(): Promise<void> {
    const confirmed = await this.popupService.confirmDanger(
      'Delete User',
      'Are you sure you want to delete this user? This action cannot be undone.',
      'Delete'
    );
    if (confirmed) {
      // In real usage, you would delete the user here
      // For demo purposes, we just log the result
      console.log('User deletion confirmed');
    } else {
      console.log('User deletion cancelled');
    }
  }

  async showConfirm(): Promise<void> {
    const confirmed = await this.popupService.confirm('Confirm Action', 'Are you sure you want to proceed?');
    if (confirmed) {
      // In real usage, you would perform the action here
      // For demo purposes, we just log the result
      console.log('Action confirmed');
    } else {
      console.log('Action cancelled');
    }
  }

  async showErrorWithRetry(): Promise<void> {
    const retry = await this.popupService.errorWithRetry('Operation failed. Would you like to retry?');
    if (retry) {
      console.log('Retrying operation...');
    }
  }

  async showCustomDialog(): Promise<void> {
    const result = await this.popupService.custom({
      title: 'Custom Dialog',
      message: 'This is a custom dialog with multiple buttons',
      size: 'lg',
      buttons: [
        {
          text: 'Option 1',
          action: () => {
            console.log('Option 1 selected');
            return true;
          },
          variant: 'solid',
          color: 'primary'
        },
        {
          text: 'Option 2',
          action: () => {
            console.log('Option 2 selected');
            return true;
          },
          variant: 'outline',
          color: 'neutral'
        },
        {
          text: 'Cancel',
          action: () => false,
          variant: 'ghost',
          color: 'neutral'
        }
      ]
    });
    console.log('Custom dialog result:', result);
  }

  basicExample = `<oct-dialog [(isOpen)]="isOpen">
  <oct-dialog-header>
    Dialog Title
  </oct-dialog-header>
  <oct-dialog-content>
    <oct-text color="2" variant="md" weight="regular">
      Your content goes here
    </oct-text>
  </oct-dialog-content>
  <oct-dialog-footer>
    <oct-button variant="outline" (buttonClick)="cancel()">Cancel</oct-button>
    <oct-button (buttonClick)="confirm()">Confirm</oct-button>
  </oct-dialog-footer>
</oct-dialog>`;

  formExample = `<oct-dialog [(isOpen)]="isOpen">
  <oct-dialog-header>
    Edit User
  </oct-dialog-header>
  <oct-dialog-content>
    <form #userForm="ngForm" class="space-y-4">
      <oct-input
        label="Name"
        name="name"
        [(value)]="user.name"
        type="text"
        size="md"
        required>
      </oct-input>
      <oct-input
        label="Email"
        name="email"
        [(value)]="user.email"
        type="email"
        size="md"
        required>
      </oct-input>
      <oct-input
        label="Role"
        name="role"
        [(value)]="user.role"
        type="text"
        size="md">
      </oct-input>
    </form>
  </oct-dialog-content>
  <oct-dialog-footer>
    <oct-button variant="outline" (buttonClick)="cancelEdit()">Cancel</oct-button>
    <oct-button (buttonClick)="saveUser()">Save Changes</oct-button>
  </oct-dialog-footer>
</oct-dialog>`;

  programmaticExample = `// In your component
@ViewChild('dialog') dialogComponent!: DialogComponent;

openDialog() {
  this.dialogComponent.openDialog();
}

closeDialog() {
  this.dialogComponent.closeDialog();
}

// Handle dialog close event
handleDialogClose() {
  console.log('Dialog closed');
}

// In your template
<oct-dialog
  #dialog
  [(isOpen)]="isDialogOpen"
  (dialogClose)="handleDialogClose()">
  <!-- dialog content -->
</oct-dialog>

<oct-button (buttonClick)="openDialog()">Open Dialog</oct-button>

<!-- Dialog can be closed by:
- Clicking the X button
- Clicking outside the dialog
- Pressing the ESC key -->`;

  // PopupService code examples
  popupServiceBasicExample = `// Component
import { Component, inject } from '@angular/core';
import { PopupService } from 'hr-ui';

export class MyComponent {
  private readonly popupService = inject(PopupService);

  async showSuccess() {
    await this.popupService.success('Operation completed successfully!');
  }

  async showError() {
    await this.popupService.error('Something went wrong.');
  }

  async showWarning() {
    await this.popupService.warning('This action cannot be undone.');
  }

  async showInfo() {
    await this.popupService.info('System maintenance tonight.');
  }
}`;

  popupServiceConfirmExample = `// Confirm dialogs
async deleteUser(userId: string) {
  const confirmed = await this.popupService.confirmDanger(
    'Delete User',
    'Are you sure you want to delete this user? This action cannot be undone.',
    this.translate,
    'Delete'
  );

  if (confirmed) {
    await this.userService.delete(userId);
    await this.popupService.success('User deleted successfully!');
  }
}

async confirmAction() {
  const confirmed = await this.popupService.confirm(
    'Confirm Action',
    'Are you sure you want to proceed?',
    this.translate
  );

  if (confirmed) {
    // Execute action
  }
}`;

  popupServiceRetryExample = `// Error with retry option
async performAction() {
  try {
    await this.apiService.doSomething();
  } catch (error) {
    const retry = await this.popupService.errorWithRetry(
      'Operation failed. Would you like to retry?'
    );

    if (retry) {
      await this.performAction(); // Retry
    }
  }
}`;

  popupServiceCustomExample = `// Custom dialog with multiple buttons
async showCustomDialog() {
  const result = await this.popupService.custom({
    title: 'Custom Dialog',
    message: 'Choose an option',
    size: 'lg',
    buttons: [
      {
        text: 'Option 1',
        action: () => {
          console.log('Option 1 selected');
          return true; // Close dialog
        },
        variant: 'solid',
        color: 'primary'
      },
      {
        text: 'Option 2',
        action: () => {
          console.log('Option 2 selected');
          return true;
        },
        variant: 'outline',
        color: 'secondary'
      },
      {
        text: 'Cancel',
        action: () => false, // Keep dialog open
        variant: 'ghost',
        color: 'neutral'
      }
    ]
  });
  console.log('Result:', result);
}`;

  // Form data update methods for template binding
  updateName(value: string): void {
    this.formData.update(f => ({ ...f, name: value }));
  }

  updateEmail(value: string): void {
    this.formData.update(f => ({ ...f, email: value }));
  }

  updatePhone(value: string): void {
    this.formData.update(f => ({ ...f, phone: value }));
  }

  async handleSave(): Promise<void> {
    const formDataValue = this.formData();

    if (this.showFormExample()) {
      // Validate form data
      if (!formDataValue.name.trim() || !formDataValue.email.trim()) {
        await this.popupService.error('Please fill in all required fields (Name and Email');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formDataValue.email)) {
        await this.popupService.error('Please enter a valid email address');
        return;
      }

      console.log('Form submitted with data:', formDataValue);
      await this.popupService.success(
        `Form submitted successfully!\nName: ${formDataValue.name}\nEmail: ${formDataValue.email}\nPhone: ${formDataValue.phone || 'Not provided'}`
      );

      // Reset form
      this.formData.set({
        name: '',
        email: '',
        phone: ''
      });
    } else {
      console.log('Save clicked (no form)');
      await this.popupService.success('Changes saved successfully!');
    }

    this.isDialogOpen.set(false);
  }
}
