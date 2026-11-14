import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, input } from '@angular/core';

@Component({
  selector: 'app-lifecycle-demo',
  templateUrl: './lifecycle-demo.html',
})
export class LifecycleDemo implements OnChanges, OnInit, OnDestroy {
  label = input('');

  constructor() {
    console.log('[ciclo] constructor');
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('[ciclo] ngOnChanges', Object.keys(changes));
  }
  ngOnInit() {
    console.log('[ciclo] ngOnInit');
  }
  ngOnDestroy() {
    console.log('[ciclo] ngOnDestroy');
  }
}
