import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {SideNavService} from '../service/side-nav.service';
import {BaseDestroyDirective} from '../directive/base-destroy.directive';
import {takeUntil} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DialogAlertComponent} from './content/dialog/dialog-alert/dialog-alert.component';


@Component({
  selector: 'app-table-page',
  templateUrl: './table-page.component.html',
  styleUrls: ['./table-page.component.scss']
})
export class TablePageComponent extends BaseDestroyDirective implements OnInit {

  @ViewChild(MatDrawer) drawer: MatDrawer;

  title = 'CryptoTableAjaxPopup';

  constructor(
    private readonly _sideNavToggleService: SideNavService,
    private readonly _dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit() {
    this._sideNavToggleService.sideNavToggle$.pipe(
      takeUntil(this._onDestroy$),
    )
      .subscribe((value: boolean) => {
        if(!this._sideNavToggleService.buttonSaveDisabled){
          this._sideNavToggleService.dialogRef = this._dialog.open(DialogAlertComponent,{
            data: {
              bSave: true,
            }
          })

          this._sideNavToggleService.dialogRef.afterClosed().subscribe(result => {
            if(!result){
              return;
            } else {
              this.toggleSide(value);
              this._sideNavToggleService.buttonSaveDisabled = true;
            }
          })
        } else {
          this.toggleSide(value)
        }
      });
  }

  toggleSide(toggle: boolean){
    if(toggle){
      this.drawer.open()
    } else {
      this.drawer.close()
      this._sideNavToggleService.closeSide()
    }
    //toggle ? this.drawer.open() : this.drawer.close();
    this._sideNavToggleService.isOpenSide = toggle;
  }
}
