import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService, Person} from '../service/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(
    private readonly _auth: AuthService,
    private readonly _router: Router,
    private readonly _shackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      user: new FormControl('', [
        Validators.required,
      ]),
      pass: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });

    this._auth.error$.subscribe(error => {
      this._shackBar.open(error, 'OK');
    })
  }

  get user() {
    return this.form.get('user');
  }

  get pass() {
    return this.form.get('pass');
  }


  getErrorMessage() {
    if (this.pass.hasError('required')) {
      return 'You must enter a password'
    }

    return `Password must be more a ${this.pass.errors?.['minlength'].requiredLength} symbols`;
  }


  submit() {
    this.submitted = true;
    //console.log("Form",this.form);
    //console.log('rout',this._router.url);
    if (this.form.invalid) return;

    const person: Person = this.form.value;

    this._auth.login(person).subscribe({
      next: () => {
        this.submitted = false;
        this.form.reset();

        if(this._router.url != '/login'){
          this._auth.closeDialog();
        } else {
          this._router.navigate(['']);
        }
      },
      error: () => {
        this.submitted = false;
        //console.log('error');
      },
    })
  }
}
