import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { noWhitespace, priceRange } from './validators';

describe('validators', () => {
  it('noWhitespace rechaza solo espacios', () => {
    expect(noWhitespace(new FormControl('   '))).toEqual({ whitespace: true });
    expect(noWhitespace(new FormControl('Mouse'))).toBeNull();
  });

  it('priceRange valida el rango', () => {
    const v = priceRange(1, 100);
    expect(v(new FormControl(0))).not.toBeNull();
    expect(v(new FormControl(50))).toBeNull();
    expect(v(new FormControl(101))).not.toBeNull();
  });
});
