import {Component, Inject, OnInit} from '@angular/core';
import {DialogRef} from '@angular/cdk/dialog';
import {CoinMarketDataService} from '../../../../../service/coin-market-data.service';
import {AuthService} from '../../../../../service/auth.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-images',
  templateUrl: './dialog-images.component.html',
  styleUrls: ['./dialog-images.component.scss']
})
export class DialogImagesComponent implements OnInit{

  images: Array<string> = [];
  isLoading:boolean;


  constructor(
    private readonly _httService: CoinMarketDataService,
    private readonly _auth: AuthService,
    public readonly dialogRef: DialogRef<DialogImagesComponent>,
    public matDialogRef: MatDialogRef<DialogImagesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
    ) {}

  ngOnInit() {
    this.dialogRef.outsidePointerEvents.subscribe(()=>{
      this.dialogRef.close();
    })
    const token = this._auth.token;
    this.isLoading = true;
    if(!token) {
      this.closeDialog()
      this._auth.openDialog();
    } else {
      this._httService.getImages(token).subscribe({
        next: (images) => {
          this.isLoading = false;
          images.forEach((item, i) =>{
            this.images[i] = 'https://inp.one/app-table/assets/thumbnails/' + item;
          });
        },
        error: err => {

        }
      })
    }
  }


  closeDialog() {
    this.dialogRef.close();
  }

  sendResult(imag: string) {
    this.matDialogRef.close(imag);
  }
}
