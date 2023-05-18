import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, Subject, tap, timestamp} from 'rxjs';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LoginPageComponent} from '../login-page/login-page.component';

export interface Person {
  user: string,
  pass: string
}

export interface AdminAuth {
  token: string,
  expire: number

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _error$: Subject<string> = new Subject<string>();
  private _openDialogRef: MatDialogRef<LoginPageComponent>;

  get error$(): Observable<string>{
    return this._error$.asObservable();
  }

  get token(): string {
    const expireDate = new Date(+localStorage.getItem('token-exp'));

    if( new Date() > expireDate) {
      this.logout()
      return null;
    }
    return localStorage.getItem('token');
  }

  constructor(
    private _http: HttpClient,
    public readonly _dialog: MatDialog,
    ) {
  }

  login(person: Person): Observable<any> {
    return this._http.post('https://api.inp.one/api/admin/', person)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      )
  }

  openDialog(){
      this._openDialogRef = this._dialog.open(LoginPageComponent,{
        disableClose: true
      })
  }

  logout() {
    const token = localStorage.getItem('token');
    this.setToken(null);

    this._http.get('https://api.inp.one/api/admin/?logout',{
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).pipe()
      .subscribe(result =>{
      })
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  closeDialog() {
    this._openDialogRef.disableClose = false;
    this._openDialogRef.close();
    //console.log("close dialog");
  };

  private handleError(error: HttpErrorResponse){
    const {message} = error.error;
    this._error$.next(message);
  }

  private setToken(response: AdminAuth | null) {
    if(response){
      const expire = Date.now() + response.expire*1000;
      localStorage.setItem('token', response.token);
      localStorage.setItem('token-exp', expire.toString());
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('token-exp');
    }

  }
}
