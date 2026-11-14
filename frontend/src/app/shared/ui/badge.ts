import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  template: `<span [class]="classes()"><ng-content /></span>`,
})
export class Badge {
  tone = input<'ok' | 'warn' | 'info'>('info');

  protected classes = computed(() => {
    const tones = {
      ok: 'bg-green-100 text-green-700',
      warn: 'bg-amber-100 text-amber-700',
      info: 'bg-brand-100 text-brand-700',
    };
    return `rounded-full px-2 py-0.5 text-xs font-medium ${tones[this.tone()]}`;
  });
}
