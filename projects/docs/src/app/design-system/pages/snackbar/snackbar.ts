import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { SnackbarService } from 'hr-ui';
import { SnackbarType, SnackbarPosition, SnackbarSize } from 'hr-ui';
import { ButtonComponent } from 'hr-ui';
import { CardComponent, CardContentComponent, CardHeaderComponent } from 'hr-ui';
import { CheckboxComponent } from 'hr-ui';
import { InputComponent } from 'hr-ui';
import { SelectComponent } from 'hr-ui';
import { TextComponent } from 'hr-ui';

interface SnackbarConfig {
  message: string;
  description?: string;
  type: SnackbarType;
  position: SnackbarPosition;
  size: SnackbarSize;
  duration: number;
  dismissible: boolean;
  persistent: boolean;
  actionText: string;
  icon: string;
}

@Component({
  selector: 'oct-snackbar-page',
  templateUrl: './snackbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TitleCasePipe,
    UpperCasePipe,
    TextComponent,
    InputComponent,
    CheckboxComponent,
    ButtonComponent,
    SelectComponent,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent
  ]
})
export class SnackbarPageComponent {
  readonly snackbarService = inject(SnackbarService);

  // Interactive playground state
  config = signal<SnackbarConfig>({
    message: 'This is a sample snackbar message',
    type: 'neutral',
    position: 'bottom-center',
    size: 'md',
    duration: 5000,
    dismissible: true,
    persistent: false,
    actionText: '',
    icon: ''
  });

  // Available options for selectors
  snackbarTypes: { type: SnackbarType; description: string; color: string }[] = [
    { type: 'success', description: 'Success messages', color: '!text-green-600' },
    { type: 'error', description: 'Error messages', color: '!text-red-600' },
    { type: 'warning', description: 'Warning messages', color: '!text-orange-600' },
    { type: 'info', description: 'Information messages', color: '!text-blue-600' },
    { type: 'neutral', description: 'General notifications', color: '!text-neutral-600' }
  ];

  snackbarPositions: { position: SnackbarPosition; label: string; description: string }[] = [
    { position: 'top-left', label: 'Top Left', description: 'Upper left corner' },
    { position: 'top-center', label: 'Top Center', description: 'Top center of screen' },
    { position: 'top-right', label: 'Top Right', description: 'Upper right corner' },
    { position: 'bottom-left', label: 'Bottom Left', description: 'Lower left corner' },
    { position: 'bottom-center', label: 'Bottom Center', description: 'Bottom center of screen' },
    { position: 'bottom-right', label: 'Bottom Right', description: 'Lower right corner' }
  ];

  snackbarSizes: { size: SnackbarSize; description: string }[] = [
    { size: 'sm', description: 'Compact size' },
    { size: 'md', description: 'Default size' },
    { size: 'lg', description: 'Large size' }
  ];

  // Computed options for selects
  typeOptions = computed(() => this.snackbarTypes.map(t => ({ label: t.type, value: t.type })));

  positionOptions = computed(() => this.snackbarPositions.map(p => ({ label: p.label, value: p.position })));

  sizeOptions = computed(() => this.snackbarSizes.map(s => ({ label: s.size.toUpperCase(), value: s.size })));

  // Demo data for quick examples
  demoExamples = [
    {
      label: 'Success',
      config: { message: 'Operation completed successfully!', type: 'success' as SnackbarType }
    },
    {
      label: 'Error',
      config: { message: 'Something went wrong. Please try again.', type: 'error' as SnackbarType, duration: 0 }
    },
    {
      label: 'Warning',
      config: { message: 'Please check your inputs before continuing.', type: 'warning' as SnackbarType }
    },
    {
      label: 'Info',
      config: { message: 'New features are now available.', type: 'info' as SnackbarType }
    },
    {
      label: 'With Action',
      config: {
        message: 'Changes saved successfully.',
        type: 'success' as SnackbarType,
        action: { text: 'Undo', handler: () => console.log('Undo clicked') }
      }
    }
  ];

  // Show snackbar using service
  showSnackbar(): void {
    const configValue = this.config();

    const snackbarConfig = {
      message: configValue.message,
      ...(configValue.description && { description: configValue.description }),
      type: configValue.type,
      position: configValue.position,
      size: configValue.size,
      duration: configValue.persistent ? 0 : configValue.duration,
      dismissible: configValue.dismissible,
      persistent: configValue.persistent,
      ...(configValue.actionText && {
        action: {
          text: configValue.actionText,
          handler: () => console.log('Action clicked:', configValue.actionText)
        }
      }),
      ...(configValue.icon && { icon: configValue.icon })
    };

    this.snackbarService.show(snackbarConfig);
  }

  // Quick demo methods
  showSuccess(): void {
    this.snackbarService.success('Operation completed successfully!');
  }

  showError(): void {
    this.snackbarService.error('Something went wrong. Please try again.');
  }

  showWarning(): void {
    this.snackbarService.warning('Please check your inputs before continuing.');
  }

  showInfo(): void {
    this.snackbarService.info('New features are now available.');
  }

  showWithAction(): void {
    this.snackbarService.success('Changes saved successfully.', {
      action: {
        text: 'Undo',
        handler: () => {
          console.log('Undo clicked');
          this.snackbarService.info('Changes have been undone.');
        }
      }
    });
  }

  showWithDescription(): void {
    this.snackbarService.info('Task completed', {
      description: 'Your document has been processed and is now available in your dashboard.'
    });
  }

  dismissAll(): void {
    this.snackbarService.dismissAll();
  }

  // Interactive playground methods
  updateConfig<K extends keyof SnackbarConfig>(key: K, value: SnackbarConfig[K]): void {
    this.config.update(config => ({ ...config, [key]: value }));
  }

  applyPreset(preset: string): void {
    switch (preset) {
      case 'default':
        this.config.set({
          message: 'This is a sample snackbar message',
          type: 'neutral',
          position: 'bottom-center',
          size: 'md',
          duration: 5000,
          dismissible: true,
          persistent: false,
          actionText: '',
          icon: ''
        });
        break;
      case 'success':
        this.config.update(config => ({
          ...config,
          message: 'Operation completed successfully!',
          type: 'success',
          actionText: '',
          icon: ''
        }));
        break;
      case 'error':
        this.config.update(config => ({
          ...config,
          message: 'Something went wrong. Please try again.',
          type: 'error',
          duration: 0,
          persistent: true,
          actionText: 'Retry',
          icon: ''
        }));
        break;
      case 'withAction':
        this.config.update(config => ({
          ...config,
          message: 'Changes saved successfully.',
          type: 'success',
          actionText: 'Undo',
          icon: ''
        }));
        break;
      case 'withIcon':
        this.config.update(config => ({
          ...config,
          message: 'Custom notification with icon',
          type: 'info',
          actionText: '',
          icon: 'Star'
        }));
        break;
      case 'persistent':
        this.config.update(config => ({
          ...config,
          message: 'This message will stay until dismissed',
          type: 'warning',
          persistent: true,
          duration: 0,
          actionText: '',
          icon: ''
        }));
        break;
    }
  }

  getActiveCount(): number {
    return this.snackbarService.getActiveCount();
  }
}
