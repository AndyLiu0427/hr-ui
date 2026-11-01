import { EnvironmentProviders, inject, Injectable, provideEnvironmentInitializer, signal } from '@angular/core';
import {
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronsUpDown,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  Clock,
  Copy,
  CornerDownLeft,
  Ellipsis,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Inbox,
  Info,
  LoaderCircle,
  type LucideIconData,
  Moon,
  Pencil,
  Pin,
  PinOff,
  RefreshCw,
  Search,
  Settings2,
  Sun,
  TriangleAlert,
  UnfoldHorizontal,
  Upload,
  UserRound,
  X
} from 'lucide-angular';

/** The Lucide icons that hr-ui components draw themselves. They are always there. */
const LIBRARY_ICONS: Readonly<Record<string, LucideIconData>> = {
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronsUpDown,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  Clock,
  Copy,
  CornerDownLeft,
  Ellipsis,
  Eye,
  EyeOff,
  Image: ImageIcon,
  Inbox,
  Info,
  LoaderCircle,
  Moon,
  Pencil,
  Pin,
  PinOff,
  RefreshCw,
  Search,
  Settings2,
  Sun,
  TriangleAlert,
  UnfoldHorizontal,
  Upload,
  UserRound,
  X
};

/**
 * The Lucide icons that oct-icon can draw by name. Only registered icons go into the app bundle,
 * so an app registers the icons its templates name with provideHrIcons().
 */
@Injectable({ providedIn: 'root' })
export class IconRegistry {
  private readonly icons = signal<Readonly<Record<string, LucideIconData>>>(LIBRARY_ICONS);

  /** The icon for a name, or undefined when it is not registered. */
  get(name: string): LucideIconData | undefined {
    return this.icons()[name];
  }

  /** Adds icons by name, such as `{ Calendar, Users }` imported from lucide-angular. */
  add(icons: Readonly<Record<string, LucideIconData>>): void {
    this.icons.update(current => ({ ...current, ...icons }));
  }
}

/**
 * Registers the Lucide icons that your templates name, in app.config.ts or in the providers of a lazy route:
 * `provideHrIcons({ Calendar, Users })`, with each icon imported from lucide-angular.
 */
export function provideHrIcons(icons: Readonly<Record<string, LucideIconData>>): EnvironmentProviders {
  return provideEnvironmentInitializer(() => inject(IconRegistry).add(icons));
}
