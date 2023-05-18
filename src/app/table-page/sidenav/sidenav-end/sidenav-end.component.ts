import {Component, OnInit} from '@angular/core';
import {CoinCard, CoinContent, CoinData, CoinMarketDataService} from '../../../service/coin-market-data.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SideNavService} from '../../../service/side-nav.service';
import {take, takeUntil} from 'rxjs';
import {
  DialogContentCoinDialogComponent
} from '../../content/dialog/dialog-content-coin-dialog/dialog-content-coin-dialog.component';
import {BaseDestroyDirective} from '../../../directive/base-destroy.directive';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {DecimalPipe} from '@angular/common';
import {DialogSettingsCardComponent} from './dialog-settings-card/dialog-settings-card.component';
import {DialogSettingsBlockComponent} from './dialog-settings-block/dialog-settings-block.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {AuthService} from '../../../service/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DragDropService} from '../../../service/drag-drop.service';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-sidenav-end',
  templateUrl: './sidenav-end.component.html',
  styleUrls: ['./sidenav-end.component.scss']
})
export class SidenavEndComponent extends BaseDestroyDirective implements OnInit {


  title = 'CryptoTableAjaxPopup';
  dataCoinContent: CoinContent[];
  dataCoin: CoinData;
  supply: number | null;
  isLoadingContent: boolean;
  isLoadingProgressBar: boolean;
  sessionDataCoin: Map<string, CoinContent[]> = new Map();
  menuArray = ['Markets'];
  moveX: number;
  mouseDown = false;
  dragActive = false;
  isCheckerChange: boolean;
  isCheckerChanging: boolean;
  checkerStatus: boolean;
  //buttonSaveDisabled: boolean;
  //placeHoldBlock: CoinContent;


  toggles: boolean; //It's toggle target for link in the element of card open in window(true) or _blank(false)


  constructor(
    private readonly _matDialog: MatDialog,
    public readonly _sideNavToggleService: SideNavService,
    private readonly _httpService: CoinMarketDataService,
    private readonly _pipeNumber: DecimalPipe,
    private readonly _auth: AuthService,
    private readonly _snack: MatSnackBar,
    private readonly _drag: DragDropService
  ) {
    super();
  }

  ngOnInit() {

    this._httpService.error$.subscribe(error => {
      this._snack.open(error, 'OK');
    })

    this.toggles = !!localStorage.getItem('openLinkInWindow');

    this._sideNavToggleService.sideNavData$
      .pipe(
        takeUntil(this._onDestroy$),
      )
      .subscribe((data) => {
        this.dataCoin = data;
        //console.log('dataCoin', data, this.sessionDataCoin);

        this.supply = this.calculateSupply();

        this.isLoadingContent = true;
        this._sideNavToggleService.buttonSaveDisabled = true;
        //console.log('ContentIsLoadingTrue',this.isLoadingContent);

        // if(this.sessionDataCoin.has(data.id)){
        //   this.dataCoinContent = this.sessionDataCoin.get(data.id);
        //   setTimeout(()=>{
        //     this.isLoadingContent = false;
        //   },300)
        //
        //   //console.log('ContentIsLoadingFalse',this.isLoadingContent);
        //   return;
        // }

        this.isLoadingProgressBar = true;
        this._sideNavToggleService.isLoading = true;
        //console.log('serviceTriggerIsLoading',this._sideNavToggleService.isLoading);

        this._httpService.fetchDataCoinContent(this.dataCoin.id, this.dataCoin.symbol)
          .pipe(take(1))
          .subscribe((dataContent) => {
            this.dataCoinContent = dataContent;
            //this.sessionDataCoin.set(data.id, dataContent);

            //console.log('dataContent', dataContent);
            this.isLoadingProgressBar = false;
            this.isLoadingContent = this._sideNavToggleService.isLoading = false;
            //console.log('lastTriggerFalse', this._sideNavToggleService.isLoading)
          });
      });


  }


  openCoinContentDialog(): MatDialogRef<any> {
    return this._matDialog.open(DialogContentCoinDialogComponent, {
      data: this.dataCoin,
      autoFocus: false,
    });
  }

  closeSideNav() {
    this._sideNavToggleService.toggleSideNav(false);
  }

  cardCoinListener(card: CoinCard, block: CoinContent, $event?) {
    let url = card.url;
    let title = card.title;

    if (card.chart) {
      this.dataCoin['card'] = card;
      this.openCoinContentDialog();
      $event.preventDefault();
      return;
    }

    switch (card.title) {
      case 'Tradingview': {
        this.openCoinContentDialog();
        $event.preventDefault();
        return;
      }
      case 'Coindar': {
        if (block.default) url = card.url.replace('!', this.dataCoin.market_cap_rank.toString());
        break;
      }

      default : {
        if (block.default) url = card.url.replace('!', this.dataCoin.id);
      }
    }

    if (block.title == "Change" && !["Coingecko", "CoinMarketCap", 'BestChange'].includes(card.title) && block.default) url = card.url.replace('!', this.dataCoin.symbol.toUpperCase());

    this.windowOpen(url, title, $event);
    card.url = url;
  }

  windowOpen(url: string, title: string, $event: MouseEvent) {
    if (this.toggles) {
      window.open(url, title, 'width=1200,height=720');
      $event.preventDefault();
    }
  }


  windowOpenSlideChange($event: MatSlideToggleChange) {
    $event.checked ? localStorage.setItem('openLinkInWindow', 'true') : localStorage.removeItem('openLinkInWindow');
  }

  calculateSupply(): number | null {
    let value = this.dataCoin.max_supply;
    if (value) {
      value = this.dataCoin.circulating_supply * 100 / value;
      //console.log(value);
    }
    return value;
  }

  supplyTooltip() {
    let str = `Supply: ${this._pipeNumber.transform(this.supply, '1.0-2')}% \n Circ.Sup.: ${this._pipeNumber.transform(this.dataCoin.circulating_supply)} \n Max-Sup.: ${this._pipeNumber.transform(this.dataCoin.max_supply)}`;
    return str;
  }

  menuUrls(card: CoinCard, block: CoinContent) {
    if (block.default) {
      const symbol = this.dataCoin.symbol.toUpperCase();
      card.urls.map((item) => {
        let url = item.url;

        switch (card.title) {
          case 'Markets': {
            url = url.replace('!', this.dataCoin.id);
            break;
          }
          default: {
            url = url.replace('!', symbol);
          }
        }

        item.title = item.title.replace('!', symbol);
        item.url = url;
        //item.url = item.url.replace('!',symbol);
        //if(card.title == 'Markets') item.url = item.url.replace('!',this.dataCoin.id);
      })
      //console.log(card.urls);
    }
  }

  menuClick($event: MouseEvent, item: { title: string; url: string }) {
    this.windowOpen(item.url, item.title, $event);
  }

  addClassText(price: number) {
    return (price > 0) ? 'text-green-500' : 'text-red-500';
  }

  moveCloseNav($event) {

    // if(this.mouseDown){
    //   if($event.clientX > this.moveX){
    //     this.mouseDown = !this.mouseDown;
    //     this.closeSideNav();
    //   }
    // } else {
    //   this.moveX = $event.clientX + 150;
    // }
    //console.log('moseDown',this.mouseDown);
  }


  notCompareObject(obj1: Object, obj2: Object) {
    const temp = JSON.stringify(obj1);
    return (temp != JSON.stringify(obj2));
  }


  addCardItem(indexBlock: number): void {
    const dialogRef = this._matDialog.open(DialogSettingsCardComponent, {
      data: {
        card: {
          title: '',
          url: '',
          thumbnailUrl: '',
          desc: '',
          menuActive: false
        }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed',result);
      if (!result) return;
      this._sideNavToggleService.buttonSaveDisabled = false;

      let block = this.dataCoinContent[indexBlock];

      //console.log('Block coin content:', indexBlock);
      //console.log('Block content:', this.dataCoinContent[indexBlock]);
      if (block.links) {
        this.dataCoinContent[indexBlock].links.push(result);
      } else {
        this.dataCoinContent[indexBlock] = {
          title: this.dataCoinContent[indexBlock].title,
          links: [
            result
          ]
        }
      }

    });
  }

  addBlockItem(indexBlock: number) {
    let tempArr: CoinContent[];
    const dialogRef = this._matDialog.open(DialogSettingsBlockComponent, {
      data: {
        title: '',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed',result);
      if (!result || result == 'delete') return;
      this._sideNavToggleService.buttonSaveDisabled = false;
      //console.log('Block coin content:', indexBlock);
      //console.log('Block content:', this.dataCoinContent[indexBlock]);
      tempArr = this.dataCoinContent.splice(indexBlock + 1);
      //console.log('TempAtt:', tempArr);
      this.dataCoinContent.push(result);
      this.dataCoinContent = this.dataCoinContent.concat(tempArr);

    });
  }

  editCard(indexBlock: number, indexCard: number, card: CoinCard, block?: CoinContent) {
    const dialogRef = this._matDialog.open(DialogSettingsCardComponent, {
      data: {
        indexBlock: indexBlock,
        indexCard: indexCard,
        card: card,
        block: block
      }
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe(result => {
        if (!result) return;


        //console.log('State',dialogRef.getState());

        if (result == 'delete') {
          this._sideNavToggleService.buttonSaveDisabled = false;
          this.dataCoinContent[indexBlock].links = this.dataCoinContent[indexBlock].links.filter((card, i) => i != indexCard)
          return;
        }


        if (this.notCompareObject(card, result)) {
          this.dataCoinContent[indexBlock].links[indexCard] = result;
          this._sideNavToggleService.buttonSaveDisabled = false;
        }
      });
  }

  editBlockItem(indexBlock: number, blockData: CoinContent) {
    const dialogRef = this._matDialog.open(DialogSettingsBlockComponent, {
      data: blockData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;


      if (result == 'delete!') {
        this._sideNavToggleService.buttonSaveDisabled = false;
        this.dataCoinContent = this.dataCoinContent.filter((block, i) => i != indexBlock)
        return;
      }

      const temp = {...blockData};
      blockData.title = result.title;
      if (this.notCompareObject(temp, blockData)) {
        this._sideNavToggleService.buttonSaveDisabled = false;
      }

    })
  }

  dropCard($event: CdkDragDrop<CoinCard>, indexBlock: number) {
    this._sideNavToggleService.buttonSaveDisabled = false;
    moveItemInArray(this.dataCoinContent[indexBlock].links, $event.previousIndex, $event.currentIndex);
  }

  sendCoinData() {
    this.isLoadingProgressBar = true;
    if (!this._auth.isAuthenticated()) {
      this._auth.openDialog()
      //open dialog for try to pass authorization;
    } else {
      this._sideNavToggleService.buttonSaveDisabled = true;
      //console.log('Send coin data:', this.dataCoinContent);
      //send the dataCoinContent to database ->
      this._httpService.sendDataToBase(this.dataCoinContent, this.dataCoin)
        .subscribe({
          next: (res) => {
            this.isLoadingProgressBar = false;
            if (this.dataCoin.written == undefined) this.dataCoin.written = false;
            if (res.insert) this._snack.open('Insert success', null, {
              duration: 2000,
              horizontalPosition: 'left'
            });
            if (res.update) this._snack.open('Update success', '', {
              duration: 2000,
              horizontalPosition: 'left'
            });
          },
          error: (err) => {
            this.isLoadingProgressBar = false;
          }
        })
    }

  }

  replaceContent() {
    this.isLoadingProgressBar = true;
    if (!this._auth.isAuthenticated()) {
      this._auth.openDialog()

    } else {
      const token = this._auth.token;
      this._httpService.getTemplateContent(token)
        .subscribe({
          next: temp => {
            this.dataCoinContent = temp;
            this.isLoadingProgressBar = false;
          },
          error: err => {
            this.isLoadingProgressBar = false;
          }
        })
    }
  }

  ClassScroll() {
    return (this.dataCoin && this.dataCoin.name == 'All') ? 'scroll-coin-content-all' : 'scroll-coin-content';
  }

  changeWritten($event: MatCheckboxChange) {
    const token = this._auth.token;
    this.isCheckerChange = undefined;
    this.checkerStatus = true;
    this.isCheckerChanging = true;
    this._httpService.updateChecker($event.checked,this.dataCoin,token)
      .subscribe({
        next: result =>{
          this.isCheckerChanging = false;
          this.isCheckerChange = true;
          setTimeout(()=> {this.checkerStatus = false; this.isCheckerChange = undefined}
            , 1500);
        },
        error: err => {
          this.isCheckerChange = false;
          this.isCheckerChanging = false;
          this.dataCoin.written = !$event.checked;
          setTimeout(()=> {this.checkerStatus = false; this.isCheckerChange = undefined}
            , 1500);
        }
      })
  }
}
