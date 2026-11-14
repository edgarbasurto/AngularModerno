import { Component, inject } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-toast-container',
  template: `
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      @for (t of notifications.toasts(); track t.id) {
        <div
          class="rounded-lg px-4 py-2 text-sm text-white shadow-lg"
          [class]="t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-slate-700'"
          (click)="notifications.dismiss(t.id)"
        >
          {{ t.message }}
        </div>
      }
    </div>
  `,
})
export class ToastContainer {
  notifications = inject(NotificationService);
}
