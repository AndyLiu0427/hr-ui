export type SnackbarType = 'success' | 'error' | 'warning' | 'info' | 'neutral';
export type SnackbarPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type SnackbarSize = 'sm' | 'md' | 'lg';

export interface SnackbarConfig {
  message: string;
  description?: string;
  type?: SnackbarType;
  position?: SnackbarPosition;
  size?: SnackbarSize;
  duration?: number;
  dismissible?: boolean;
  action?: {
    text: string;
    handler: () => void;
  };
  icon?: string;
  persistent?: boolean;
  index?: number;
  height?: number;
}

export interface SnackbarRef {
  id: string;
  config: SnackbarConfig;
  dismiss: () => void;
}
