import { Component } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  form: FormGroup = new FormGroup({
    title: new FormControl('21'),
    url: new FormControl(''),
    thumbnail: new  FormControl(''),
  });

  submitForm() {
    console.log('Form', this.form);
  }
}
