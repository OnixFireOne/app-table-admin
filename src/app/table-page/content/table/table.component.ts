import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CoinData, CoinMarketDataService, WrittenCoin} from '../../../service/coin-market-data.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {DecimalPipe} from '@angular/common';

import {catchError, concatMap, delay, map, take, takeUntil, throwError} from 'rxjs';
import {BaseDestroyDirective} from '../../../directive/base-destroy.directive';
import {SideNavService} from '../../../service/side-nav.service';
import {StyleManager} from '../../../service/style-manager.service';
import {MatSelectChange} from '@angular/material/select';
import {
  DialogContentCoinDialogComponent
} from '../dialog/dialog-content-coin-dialog/dialog-content-coin-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {WindowActiveService} from '../../../service/window-active.service';
import {SettingsTableService} from '../../../service/settings-table.service';
import {DialogAlertComponent} from '../dialog/dialog-alert/dialog-alert.component';
import {AuthService} from '../../../service/auth.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent extends BaseDestroyDirective implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef<HTMLInputElement>;


  private readonly _weightTime = 5 * 60 * 1000;

  displayedColumns: string[] = [
    'market_cap_rank',
    'name', 'current_price',
    'market_cap',
    'price_change_percentage_24h',
    'price_change_percentage_7d_in_currency',
    'price_change_percentage_30d_in_currency',
    'price_change_percentage_1y_in_currency',
    'menuIcon'
  ];
  optionPage: string[] = ['1', '2', '3', '4', '5', '6', '7'];
  currentPage: string = '1';
  dataSource = new MatTableDataSource<CoinData>();
  writtenCoin: WrittenCoin[];
  isLoading = true;
  isChecked = false;
  isLoadingTable = true;
  isIntervalUpdate: boolean;
  isSliderToggle: boolean;
  //viewer= 'slide';
  CheckerSlider: string = 'slider';
  nameChecker: string = '';
  nameCoin: string;
  toggleName = true;
  // settingTable = {
  //   month:false,
  //   year:false
  // };

  constructor(
    public readonly styleManagerService: StyleManager,
    private readonly _windowActiveService: WindowActiveService,
    private readonly _coinService: CoinMarketDataService,
    private readonly _matDialog: MatDialog,
    private readonly _pipeNumber: DecimalPipe,
    private readonly _auth: AuthService,
    public readonly _sideNavService: SideNavService,
    public settingsTableService: SettingsTableService,
  ) {
    super();
  }


  ngOnInit() {

    this.initDataWithWrittenCoin();

    // this._coinService.fetchWrittenCoins(this._auth.token)
    //   .subscribe(written => this.writtenCoin = written);


    //this.initializeDataCoin(this.currentPage);
    this.initializePageTable();

    //this.isChecked = !!localStorage.getItem('openFilter');

    this.dataSource.filterPredicate = (record, filter) => {
      let name = record.name.toLowerCase();
      filter = filter.trim().toLowerCase();
      let filAr = filter.split('+');
      const leng = filAr.length;
      for (let i = 0; i < leng; i++) {
        let str = filAr[i];
        if (name.includes(str)) return true;
        if (str.includes('!')) {
          str = str.replace('!', '');
          if (name == str) return true;
        }
      }

      //if(filAr.includes(record.name.toLowerCase())) return true;

      //if(record.name.toLowerCase().includes(filter)) return true;

      if (record.market_cap_rank) return record.market_cap_rank.toString() == filter;

      return false;

    };

    this._sideNavService.sideNavToggle$.pipe(
      takeUntil(this._onDestroy$)
    ).subscribe((toggle) => {
      this.isSliderToggle = toggle
      //if(!toggle) this.nameChecker = '';
    });

    this._sideNavService.sideNavClose$
      .pipe(
        takeUntil(this._onDestroy$)
      )
      .subscribe(() => {
        // if (this._sideNavService.buttonSaveDisabled) {
        //   this.nameChecker = '';
        // }
        this.nameChecker = '';
      });
  }

  ngAfterViewInit() {

    // document.addEventListener('visibilitychange',()=>{
    //   console.log(document.hidden);
    // })


    let delayTime: number;
    let interval;
    let timeout;

    // this._windowActiveService.windowIsHidden$
    //   .pipe(takeUntil(this._onDestroy$))
    //   .subscribe((hidden) => {
    //     const time = new Date();
    //     if (hidden) {
    //       delayTime = time.getTime() + (this._weightTime);
    //       timeout = setTimeout(() => {
    //         clearInterval(interval);
    //         //console.log('timeout init: close interval')
    //
    //       }, this._weightTime);
    //     } else {
    //
    //       if (delayTime >= time.getTime()) {
    //         clearTimeout(timeout);
    //         //console.log('close time out');
    //         return;
    //       }
    //       this.isLoadingTable = true;
    //       this.initializeDataCoin(this.currentPage);
    //       interval = this.intervalDataCoin();
    //
    //     }
    //   })

    //interval = this.intervalDataCoin();

    this.dataSource.sort = this.sort;
    this.dataSource.sort.start = 'desc';
    // this.dataSource.sortingDataAccessor = (item,prop) => {
    //   let p24h = item.price_change_percentage_24h;
    //   let p7d = item.price_change_percentage_7d_in_currency;
    //   return (prop == '24h')? p24h : p7d;
    //}
    // this.dataSource.sortData = (data: CoinData[], sort: MatSort) => {
    //   const active = sort.active;
    //   const direction = sort.direction;
    //   //sort.start= 'desc';
    //   console.log(direction)
    //   return data.sort((a: CoinData, b: CoinData) => {
    //     const valueA = this.dataSource.sortingDataAccessor(a, active);
    //     const valueB = this.dataSource.sortingDataAccessor(b, active);
    //     let comparatorResult = this.compareFunction(valueA, valueB);
    //     // if they are equals
    //     if (comparatorResult == 0 || direction == '')
    //     {
    //       const valueALastName = this.dataSource.sortingDataAccessor(
    //         a,
    //         'market_cap_rank'
    //       );
    //       const valueBLastName = this.dataSource.sortingDataAccessor(
    //         b,
    //         'market_cap_rank'
    //       );
    //       comparatorResult = this.compareFunction(
    //         valueALastName,
    //         valueBLastName
    //       );
    //     }
    //
    //     return comparatorResult * (direction == 'asc' ? -1 : 1);
    //   });
    // };
  }

  // private compareFunction(a: any, b: any): number {
  //   let comparatorResult = 0;
  //   if (a != null && b != null) {
  //     // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
  //     if (a > b) {
  //       comparatorResult = 1;
  //     } else if (a < b) {
  //       comparatorResult = -1;
  //     }
  //   } else if (a != null) {
  //     comparatorResult = 1;
  //   } else if (b != null) {
  //     comparatorResult = -1;
  //   }
  // if (a < 0 && b < 0){
  //   if (a > b) {
  //     comparatorResult = 1;
  //   } else if (a < b) {
  //     comparatorResult = -1;
  //   }
  // }
  //return comparatorResult;
  //}


  initializeDataCoin(page: string) {
    this._coinService.fetchCoins(page).pipe(
    )
      .subscribe({
        next: coins => {
          // if(page == '1'){
          //   let global = coins.shift();
          // }

          coins.forEach(value => {
            let checked = this.writtenCoin.filter(wr => wr.symbol == value.symbol)[0];
            if (checked) {
              value.written = !!+checked.checked;
            }
          })

          this.dataSource.data = coins;

          this.isLoading = false;
          this.isLoadingTable = false;
        },
        error: err => {
          this.isLoading = false;
          this.isLoadingTable = false;
        }
      })
  }

  intervalDataCoin() {

    return setInterval(() => {
      this.indicatorUpdate();
      this._coinService.fetchCoins(this.currentPage)
        .pipe(
          delay(2000),
          takeUntil(this._onDestroy$),
          catchError((error) => {
            console.log(error.message)
            return throwError(error)
          })
        )
        .subscribe((data) => {
          this.dataSource.data = data;
          setTimeout(() => {
            this.isIntervalUpdate = false;
          }, 2000);
        })

      //console.log('interval Init')

    }, this._weightTime)
  }

  initDataWithWrittenCoin(){
    const token = this._auth.token;
    this._coinService.fetchCoins(this.currentPage)
      .pipe(
        concatMap(data => this._coinService.fetchWrittenCoins(token)
          .pipe(
            map(written => { return {data,written}})
          ))
      )
      .subscribe({
        next: coins => {
          this.writtenCoin = coins.written;

          coins.data.forEach(value => {
            const checked = this.writtenCoin.filter(wr => wr.symbol == value.symbol)[0];
            if (checked) {
              value.written = !!+checked.checked;
            }
          })

          this.dataSource.data = coins.data;
          this.isLoading = false;
          this.isLoadingTable = false;
        },
        error: err => {
          this.isLoading = false;
          this.isLoadingTable = false;
        }
      })
  }


  indicatorUpdate() {
    setTimeout(() => {
      this.isIntervalUpdate = true;
    }, 100);


    setTimeout(() => {
      this.isIntervalUpdate = false;
    }, 10 * 1000)
  }

  // switcherSlider(string){
  //   this.CheckerSlider = string;
  // }

  // initModal(element: CoinData) {
  //
  //   switch (this.CheckerSlider) {
  //     case 'slider': {
  //       if(this.isChecked){
  //         const dialog = this._dialogService.openCoinContentDialog({
  //           data: element,
  //           autoFocus: false,
  //         });
  //         break;
  //       }
  //       this._sideNavService.toggleSideNav(true)
  //       break;}
  //     case 'buttonToggle': {
  //       switch (this.viewer) {
  //         case 'slide': {
  //           this._sideNavService.toggleSideNav(true)
  //           break;
  //         }
  //         case 'modal': {
  //           const dialog = this._dialogService.openCoinContentDialog({
  //             data: element,
  //             autoFocus: false,
  //           });
  //           break;}
  //       }
  //       break;}
  //
  //   }
  //
  //
  // }


  numberFormat(currency: number) {
    const l = currency.toString().length;
    return (l > 9) ? this._pipeNumber.transform(currency / 1000000000, '1.0-3') + ' B$' : this._pipeNumber.transform(currency / 1000000, '1.0-3') + ' M$';
  }

  addTextClass(p24h: number): string {
    return (p24h > 0) ? 'text-green-500' : 'text-red-500';
  }

  checkOpenSlider(element: CoinData) {
    if (this._sideNavService.buttonSaveDisabled) {

      this.openSlider(element);

    } else {
      const dialogRef = this._matDialog.open(DialogAlertComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (!result)
          return
        else {
          this._sideNavService.buttonSaveDisabled = true;
          this.openSlider(element);
        }
      })
    }
  }

  openSlider(element: CoinData) {
    let open: boolean;
    const nameCoin = element.name;

    //console.log('tableServiceTrigger', this._sideNavService.isLoading);
    if (this._sideNavService.isLoading) return;

    if (this.nameChecker != nameCoin) {
      this.nameChecker = nameCoin;
      open = true;
    } else {
      this.nameChecker = '';
      open = !this._sideNavService.isOpenSide;
    }

    this._sideNavService.toggleSideNav(open);
    if (open) this._sideNavService.pushDataCoin(element);

  }

  parsUrls(image: string): string {
    image = image.substring(8).split('/')[3];
    return image
  }

  selectionChange($event: MatSelectChange) {
    this.isLoadingTable = true;
    this.initializeDataCoin(this.currentPage);
    //console.log($event.source.id,":id");
    if ($event.source.id != 'mat-select-0') this.goUP();
  }

  goUP() {
    setTimeout(() => {
      document.getElementById("mainMenu").scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }, 300);
  }

  private initializePageTable() {
    this._coinService.getPagesTable().pipe(
      take(1),
    ).subscribe((p) => {
      for (let i = 0; i < p.pages; i++) {
        let p = i + 1;
        this.optionPage[i] = p.toString();
      }
    })
  }

  refreshTable() {
    this.isLoadingTable = true;
    this.initializeDataCoin(this.currentPage);
  }

  refreshDataTable() {
    this.isLoadingTable = true;
    this.initDataWithWrittenCoin();
  }

  applyFilter($event: Event) {
    this.dataSource.filter = ($event.target as HTMLInputElement).value;
  }

  openDialog(element: CoinData) {
    this._matDialog.open(DialogContentCoinDialogComponent, {
      data: element,
      autoFocus: false,
    });
  }

  openFilter($event: MatSlideToggleChange) {
    $event.checked ? localStorage.setItem('openFilter', 'true') : localStorage.removeItem('openFilter');
  }

  numberFormatPrice(price): string {
    if (!price) return '';
    let count = price * 100;
    price = (count > 1) ? this._pipeNumber.transform(price, '1.0-4') : this._pipeNumber.transform(price, '1.1-6');
    return price + ' $';
  }

  checkInputValue(): string {
    return (this.input) ? this.input.nativeElement.value : '';
  }

  nameViewer(name: string): string {

    if (name.length > 10) {
      name = name.substring(0, 10) + '.';
      this.nameCoin = name;
    }
    this.nameCoin = name;
    return this.nameCoin;
  }

  // changeTableColumn($event: MatSlideToggleChange) {
  //   let month = 'price_change_percentage_30d_in_currency';
  //   let year = 'price_change_percentage_1y_in_currency';
  //
  //   if(this.settingTable.month && this.settingTable.year) {
  //     this.displayedColumns = [
  //       'market_cap_rank',
  //       'name', 'current_price',
  //       'market_cap',
  //       'price_change_percentage_24h',
  //       'price_change_percentage_7d_in_currency',
  //       'price_change_percentage_30d_in_currency',
  //       'price_change_percentage_1y_in_currency',
  //       'menuIcon'
  //     ]
  //     //let last = this.displayedColumns.pop();
  //     //this.displayedColumns.push(month,year);
  //     return;
  //   }
  //
  //   if(!this.settingTable.month && !this.settingTable.year){
  //     this.displayedColumns = [
  //       'market_cap_rank',
  //       'name', 'current_price',
  //       'market_cap',
  //       'price_change_percentage_24h',
  //       'price_change_percentage_7d_in_currency',
  //       'menuIcon'
  //     ]
  //     //this.displayedColumns
  //     return;
  //   }
  //
  //   if(this.settingTable.month){
  //     this.displayedColumns = [
  //       'market_cap_rank',
  //       'name', 'current_price',
  //       'market_cap',
  //       'price_change_percentage_24h',
  //       'price_change_percentage_7d_in_currency',
  //       'price_change_percentage_30d_in_currency',
  //       'menuIcon'
  //     ]
  //   }
  //
  //   if(this.settingTable.year){
  //     this.displayedColumns = [
  //       'market_cap_rank',
  //       'name', 'current_price',
  //       'market_cap',
  //       'price_change_percentage_24h',
  //       'price_change_percentage_7d_in_currency',
  //       'price_change_percentage_1y_in_currency',
  //       'menuIcon'
  //     ]
  //   }
  //
  //
  //   // if(this.settingTable.year){
  //   //   this.displayedColumns.push(year);
  //   //
  //   //
  //   // } else {
  //   //   this.displayedColumns.unshift(year)
  //   //
  //   // }
  // }
  clickedMenu() {

  }

  writtenCoinCheck(element: CoinData): string {
    if (this.writtenCoin) {
      const coin = this.writtenCoin.filter(coin => coin.symbol == element.symbol)[0];
      if (coin) {
        const check = !!coin.checked;
        return check ? 'limegreen' : 'bg-orange-400';
      }
    }
    return 'opacity-0';
  }

  notRedact(): number {
    let count = 0;
    count = this.writtenCoin.filter(v => !+v.checked).length;
    return count
  }
}
