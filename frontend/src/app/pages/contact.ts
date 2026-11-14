import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../shared/ui/button';

/** Template-driven: el formulario se define en el HTML con ngModel. */
@Component({
  selector: 'app-contact',
  imports: [FormsModule, Button],
  templateUrl: './contact.html',
})
export class Contact {
  model = { name: '', email: '', message: '' };
  sent = false;

  send(value: unknown) {
    console.log('Contacto', value);
    this.sent = true;
  }
}
