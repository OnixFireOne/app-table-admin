import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {CoinData} from './coin-market-data.service';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogAlertComponent} from '../table-page/content/dialog/dialog-alert/dialog-alert.component';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {


  private readonly _sideNavToggle$: Subject<boolean> = new Subject<boolean>();
  private readonly _sideNavData$: Subject<CoinData> = new Subject<CoinData>();
  private readonly _sideNavClose$: Subject<void> = new Subject<void>();

  public isLoading: boolean;
  public isOpenSide: boolean;
  public buttonSaveDisabled: boolean = true;
  public dialogRef: MatDialogRef<any>

  get sideNavToggle$(): Observable<boolean> {
    return this._sideNavToggle$.asObservable();
  }
  get sideNavData$(): Observable<CoinData> {
    return this._sideNavData$.asObservable();
  }
  get sideNavClose$(): Observable<void> {
    return this._sideNavClose$.asObservable();
  }


  constructor(
  ) { }

  toggleSideNav(open: boolean): void {
    this._sideNavToggle$.next(open);
  }
  pushDataCoin(data: CoinData): void {
    if(this.buttonSaveDisabled){
      this._sideNavData$.next(data)
    } else {
      this.dialogRef.afterClosed().subscribe(result => {
        if(result){
          this._sideNavData$.next(data);
        } else {
          return;
        }
      })
    }

  }

  closeSide(): void {
    this._sideNavClose$.next();
  }

}
