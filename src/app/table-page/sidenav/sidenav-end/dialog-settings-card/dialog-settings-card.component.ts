import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CoinCard, CoinContent} from '../../../../service/coin-market-data.service';
import {FormGroup} from '@angular/forms';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MatSelectChange} from '@angular/material/select';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {DialogImagesComponent} from './dialog-images/dialog-images.component';
import {cloneDeep} from 'lodash-es';

export interface DataDialog{
  indexBlock: number,
  indexCard: number
  card: CoinCard,
  block: CoinContent
}

@Component({
  selector: 'app-dialog-settings-card',
  templateUrl: './dialog-settings-card.component.html',
  styleUrls: ['./dialog-settings-card.component.scss']
})
export class DialogSettingsCardComponent implements OnInit, OnDestroy{

  form: FormGroup;
  card: CoinCard;
  buttonMore = false;
  currentPosition: number = this.data.indexCard + 1;
  optionPosition: Array<number>;
  //urls: CoinCard['urls'];


  constructor(
    public readonly dialogRef: MatDialogRef<DialogSettingsCardComponent>,
    private readonly _dialogImages: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog
  ) {}

  ngOnInit() {
    // this.form = new FormGroup({
    //   title: new FormControl(this.data.title),
    //   url: new FormControl(this.data.url),
    //   thumbnailUrl: new FormControl(this.data.thumbnailUrl),
    //   desc: new FormControl(this.data.desc),
    //   menuActive: new FormControl(this.data.menuActive),
    // });

    // let group = {};
    //
    // Object.keys(this.data).forEach(key => {
    //
    //   if(Array.isArray(this.data[key])){
    //     let arr = [];
    //     this.data[key].forEach((item, ind) => {
    //       let tObj = {};
    //       Object.keys(item).forEach((key) => {
    //         tObj[key] = new FormControl(item[key]);
    //         //arr[i] = new FormControl(item[key]);
    //       })
    //       arr[ind] = new FormGroup(tObj);
    //       //arr[ind] = tObj;
    //     })
    //     group[key] = new FormArray(arr);
    //     return;
    //   }
    //   group[key] = new FormControl(this.data[key]);
    // })
    //
    // this.form = new FormGroup(group);

    this.card = cloneDeep(this.data.card);

    // this.card = {...this.data.card};
    // this.urls = [...this.data.card.urls];


    let arrIndex = [];

    if(this.data.block){
      this.data.block.links.forEach((v,i)=>{
        arrIndex[i] = i+1;
      })
    }


    this.optionPosition = arrIndex;
    // this.currentPosition = this.data.indexCard+1;
  }

  ngOnDestroy() {
    //this._dialogImages.closeAll();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  dialogCloseResult() {

    Object.keys(this.card).forEach((key) =>{
      if(this.card[key]){
        if(key == 'urls'){
          //this.card[key] = this.urls;
        } else {
          this.card[key] = this.card[key];
        }
      }
    })

    this.dialogRef.close(this.card);
  }

  addMoreOptions() {
    // const more = ['desc', 'chart', 'menuActive','symbol'];
    // const current = Object.keys(this.card);
    //
    // more.forEach((key)=>{
    //   if(!current.includes(key)){
    //     this.card[key] = '';
    //   }
    // })

    this.buttonMore = !this.buttonMore;

    //console.log(this.card);

  }


  addItemToMenu() {
    this.card.urls.push({title:'', url:''});
  }

  removeItemToMenu() {
    this.card.urls.pop();

    if(this.card.urls.length < 1){
      this.card.menuActive = false;
      this.card.urls = undefined;
    }
  }

  changeBoxMenu($event: MatCheckboxChange) {
    if($event.checked){
      this.card.chart = false;
      if(!this.card.urls){
        this.card.urls = [
          {title: '', url: ''}
        ]
      }
    }
  }

  changeBoxChart($event: MatCheckboxChange) {
    if($event.checked){
      this.card.menuActive = false;
    }
  }

  selectionChange($event: MatSelectChange) {
    const toIndex = $event.value - 1;
    moveItemInArray(this.data.block.links,this.data.indexCard,toIndex);
  }

  dialogImages() {
    const dialogRef = this._dialogImages.open(DialogImagesComponent,{
      hasBackdrop: false,
      data: this.card.thumbnailUrl,
    })

    dialogRef.afterClosed().subscribe((res) => {
      if(res){
        this.card.thumbnailUrl = res;
      }
    })

  }

}
