import { signal, computed, ComponentRef, inject, ApplicationRef, createComponent, EnvironmentInjector, Service } from '@angular/core';
import { SnackbarComponent } from './snackbar';
import { SnackbarConfig, SnackbarRef, SnackbarPosition } from './snackbar.interface';

@Service()
export class SnackbarService {
  private applicationRef = inject(ApplicationRef);
  private environmentInjector = inject(EnvironmentInjector);

  // Active snackbars registry organized by position
  private snackbars = signal<Map<string, { id: string; ref: ComponentRef<SnackbarComponent>; config: SnackbarConfig; position: SnackbarPosition }>>(
    new Map()
  );

  // Computed array of active snackbars for easier access
  readonly activeSnackbars = computed(() => Array.from(this.snackbars().values()));

  // Counter for unique IDs
  private idCounter = 0;

  /**
   * Show a snackbar with the given configuration
   */
  show(config: SnackbarConfig): SnackbarRef {
    const id = this.generateId();
    const fullConfig = this.mergeWithDefaults(config);
    const position = fullConfig.position!;

    // Calculate the index for this position
    const indexAtPosition = this.getSnackbarCountAtPosition(position);
    fullConfig.index = indexAtPosition;

    const componentRef = this.createSnackbarComponent(fullConfig);

    // Store the snackbar reference
    this.snackbars.update(snackbars => {
      const newMap = new Map(snackbars);
      newMap.set(id, { id, ref: componentRef, config: fullConfig, position });
      return newMap;
    });

    // Calculate initial offset for this new snackbar
    this.updateOffsetsAtPosition(position);

    // Setup dismiss handler
    const dismissHandler = () => this.dismiss(id);
    componentRef.instance.dismiss.subscribe(dismissHandler);

    // Setup height change handler
    componentRef.instance.heightChange.subscribe(height => {
      this.updateSnackbarHeight(id, height);
    });

    // Setup action handler if provided
    if (fullConfig.action) {
      componentRef.instance.actionClick.subscribe(() => {
        fullConfig.action!.handler();
        if (!fullConfig.persistent) {
          dismissHandler();
        }
      });
    }

    // Append to DOM
    document.body.appendChild(componentRef.location.nativeElement);
    this.applicationRef.attachView(componentRef.hostView);

    return {
      id,
      config: fullConfig,
      dismiss: dismissHandler
    };
  }

  /**
   * Show a success snackbar with optimized defaults
   */
  success(message: string, options?: Partial<SnackbarConfig>): SnackbarRef {
    return this.show({
      message,
      type: 'success',
      position: 'top-center',
      duration: 3000,
      dismissible: true,
      ...options
    });
  }

  /**
   * Show an error snackbar with optimized defaults
   */
  error(message: string, options?: Partial<SnackbarConfig>): SnackbarRef {
    return this.show({
      message,
      type: 'error',
      position: 'top-center',
      duration: 0, // Errors stay until dismissed so the user can read what to fix
      dismissible: true,
      ...options
    });
  }

  /**
   * Show a warning snackbar with optimized defaults
   */
  warning(message: string, options?: Partial<SnackbarConfig>): SnackbarRef {
    return this.show({
      message,
      type: 'warning',
      position: 'top-center',
      duration: 0, // Don't auto-dismiss warnings - they need user attention
      dismissible: true,
      persistent: true,
      ...options
    });
  }

  /**
   * Show an info snackbar with optimized defaults
   */
  info(message: string, options?: Partial<SnackbarConfig>): SnackbarRef {
    return this.show({
      message,
      type: 'info',
      position: 'top-center',
      duration: 5000,
      dismissible: true,
      ...options
    });
  }

  /**
   * Dismiss a specific snackbar by ID
   */
  dismiss(id: string): void {
    const snackbar = this.snackbars().get(id);
    if (!snackbar) return;

    const position = snackbar.position;

    // Trigger exit animation
    snackbar.ref.instance.animationState.set('void');

    // Listen for dismiss event from component (triggered after animation)
    const subscription = snackbar.ref.instance.dismiss.subscribe(() => {
      subscription.unsubscribe();
      this.cleanup(id);
      this.reindexSnackbarsAtPosition(position);
    });
  }

  /**
   * Dismiss all active snackbars
   */
  dismissAll(): void {
    const ids = Array.from(this.snackbars().keys());
    ids.forEach(id => this.dismiss(id));
  }

  /**
   * Get count of active snackbars
   */
  getActiveCount(): number {
    return this.snackbars().size;
  }

  /**
   * Check if a snackbar is currently active
   */
  isActive(id: string): boolean {
    return this.snackbars().has(id);
  }

  private generateId(): string {
    return `snackbar-${++this.idCounter}-${Date.now()}`;
  }

  private mergeWithDefaults(config: SnackbarConfig): Required<SnackbarConfig> {
    return {
      message: config.message,
      description: config.description ?? undefined,
      type: config.type ?? 'neutral',
      position: config.position ?? 'bottom-center',
      size: config.size ?? 'md',
      duration: config.duration ?? 5000,
      dismissible: config.dismissible ?? true,
      action: config.action ?? undefined,
      icon: config.icon ?? undefined,
      persistent: config.persistent ?? false
    } as Required<SnackbarConfig>;
  }

  private createSnackbarComponent(config: SnackbarConfig): ComponentRef<SnackbarComponent> {
    const componentRef = createComponent(SnackbarComponent, {
      environmentInjector: this.environmentInjector
    });

    // Set input values
    componentRef.setInput('message', config.message);
    componentRef.setInput('type', config.type);
    componentRef.setInput('position', config.position);
    componentRef.setInput('size', config.size);
    componentRef.setInput('duration', config.duration);
    componentRef.setInput('dismissible', config.dismissible);
    componentRef.setInput('persistent', config.persistent);
    componentRef.setInput('index', config.index ?? 0);
    componentRef.setInput('offset', 0); // Initial offset, will be updated

    if (config.description) {
      componentRef.setInput('description', config.description);
    }

    if (config.action) {
      componentRef.setInput('actionText', config.action.text);
    }

    if (config.icon) {
      componentRef.setInput('icon', config.icon);
    }

    return componentRef;
  }

  private getSnackbarCountAtPosition(position: SnackbarPosition): number {
    return Array.from(this.snackbars().values()).filter(s => s.position === position).length;
  }

  private reindexSnackbarsAtPosition(position: SnackbarPosition): void {
    const snackbarsAtPosition = Array.from(this.snackbars().entries())
      .filter(([_, s]) => s.position === position)
      .sort((a, b) => (a[1].config.index ?? 0) - (b[1].config.index ?? 0));

    snackbarsAtPosition.forEach(([, snackbar], newIndex) => {
      snackbar.config.index = newIndex;
      snackbar.ref.setInput('index', newIndex);
    });

    this.updateOffsetsAtPosition(position);
  }

  /**
   * Update height for a specific snackbar and recalculate offsets
   */
  updateSnackbarHeight(id: string, height: number): void {
    const snackbar = this.snackbars().get(id);
    if (!snackbar) return;

    snackbar.config.height = height;

    // Update all snackbars at this position
    this.updateOffsetsAtPosition(snackbar.position);
  }

  /**
   * Update offsets for all snackbars at a specific position based on cumulative heights
   */
  private updateOffsetsAtPosition(position: SnackbarPosition): void {
    const snackbarsAtPosition = Array.from(this.snackbars().entries())
      .filter(([_, s]) => s.position === position)
      .sort((a, b) => (a[1].config.index ?? 0) - (b[1].config.index ?? 0));

    let cumulativeOffset = 0;
    const gap = 16; // Gap between snackbars

    snackbarsAtPosition.forEach(([_id, snackbar]) => {
      snackbar.ref.setInput('offset', cumulativeOffset);

      // Use measured height or generous default based on content
      let defaultHeight = 80; // Base default
      if (snackbar.config.description) {
        defaultHeight = 120; // Larger default if has description
      }

      const height = snackbar.config.height ?? defaultHeight;
      cumulativeOffset += height + gap;
    });
  }

  private cleanup(id: string): void {
    const snackbar = this.snackbars().get(id);
    if (!snackbar) return;

    // Remove from DOM
    const element = snackbar.ref.location.nativeElement;
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }

    // Detach from Angular and destroy
    this.applicationRef.detachView(snackbar.ref.hostView);
    snackbar.ref.destroy();

    // Remove from registry
    this.snackbars.update(snackbars => {
      const newMap = new Map(snackbars);
      newMap.delete(id);
      return newMap;
    });
  }
}
