import { Component, computed, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

type Variant = 'primary' | 'secondary' | 'danger';

@Component({
  selector: 'app-button',
  imports: [NgIcon],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="classes()"
    >
      @if (icon(); as name) {
        <ng-icon [name]="name" />
      }
      <ng-content />
    </button>
  `,
})
export class Button {
  variant = input<Variant>('primary');
  type = input<'button' | 'submit'>('button');
  icon = input<string>();
  disabled = input(false);

  protected classes = computed(() => {
    const base =
      'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed';
    const styles: Record<Variant, string> = {
      primary: 'bg-brand-600 text-white hover:bg-brand-700',
      secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    };
    return `${base} ${styles[this.variant()]}`;
  });
}
