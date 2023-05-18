import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, Observable, Subject} from 'rxjs';

export interface CoinData {
  market_cap_rank: number | null,
  id: string,
  symbol: string,
  name: string,
  current_price: number | null,
  image: string,
  market_cap: number,
  price_change_percentage_24h: number,
  price_change_percentage_7d_in_currency: number | null,
  price_change_percentage_30d_in_currency?: number,
  price_change_percentage_1y_in_currency?: number,
  circulating_supply?: number,
  max_supply?: number | null,
  ath?: number,
  ath_change_percentage?: number,
  ath_date?: number,
  atl?: number,
  atl_change_percentage?: number,
  atl_date?: number,
  isLoading?: boolean,
  card?: CoinCard,
  written?: boolean | string
}

export interface WrittenCoin {
  symbol: string,
  checked: string
}

export interface CoinCard {
  title: string,
  id?: number,
  url: string,
  thumbnailUrl: string,
  desc?: string,
  chart?: boolean, //activate tradingview dialog
  symbol?: string,
  menuActive?: boolean, //activate menu, include urls
  urls?: [{
    title: string,
    url: string,
  }]
}

export interface CoinContent {
  id?: number,
  title: string,
  links?: CoinCard[],
  text?: string,
  default?: boolean,
  alert?: boolean
}

export interface PageTable {
  pages: number
}

export interface BaseResult {
  update?: boolean,
  insert?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class CoinMarketDataService {

  private readonly _error$: Subject<string> = new Subject<string>();

  get error$(): Observable<string> {
    return this._error$.asObservable();
  }

  constructor(private readonly _http: HttpClient) {
  }

  fetchCoins(page: string): Observable<CoinData[]> {
    let params = new HttpParams();
    params = params.appendAll({
      'page': page,
    })
    //url: https://api.inp.one/api/coins/
    //uelDev: /assets/dataCoin2.json
    return this._http.get<CoinData[]>(`https://api.inp.one/api/coins/`, {
      params,
    })
      .pipe(
        catchError(this.handleErrors.bind(this))
      );
  }

  fetchWrittenCoins(token: string): Observable<WrittenCoin[]>{
    return this._http.get<WrittenCoin[]>('https://api.inp.one/api/admin/?data=written',{
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    })
      .pipe(
        catchError(this.handleErrors.bind(this))
      );
  }

  fetchDataCoinContent(coinId: string, coinSymbol: string): Observable<CoinContent[]> {
    let params = new HttpParams();
    params = params.appendAll({
      'id': coinId,
      'symbol': coinSymbol
    })
    return this._http.get<CoinContent[]>(`https://api.inp.one/api/coins-content/`, {
      params
    });
  }


  getPagesTable(): Observable<PageTable> {
    //url: https://inp.one/app-table/assets/pagesTable.json
    //urlDev: /assets/pagesTable.json
    return this._http.get<PageTable>('assets/pagesTable.json');
  }


  sendDataToBase(data: CoinContent[], coin: CoinData): Observable<BaseResult> {
    const token = localStorage.getItem('token');
    const send = {
      id: coin.id,
      symbol: coin.symbol,
      data: data
    }
    return this._http.post<BaseResult>('https://api.inp.one/api/admin/?data=update', send, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    })
      .pipe(
        catchError(this.handleErrors.bind(this))
      )
  }

  updateChecker(check: boolean, coin: CoinData, token: string): Observable<any> {
    const send = {
      id: coin.id,
      symbol: coin.symbol,
      data: {
        written: check
      }
    }
    return this._http.post('https://api.inp.one/api/admin/?data=update&written=update', send, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    })
      .pipe(
        catchError(this.handleErrors.bind(this))
      )
  }

  getTemplateContent(token: string): Observable<CoinContent[]>{
    return this._http.get<CoinContent[]>('https://api.inp.one/api/admin/?data=template',{
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    })
      .pipe(
        catchError(this.handleErrors.bind(this))
      )
  }

  getImages(token: string): Observable<string[]> {
    return this._http.get<string[]>('https://api.inp.one/api/admin/?data=thumb',{
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    })
      .pipe(
        catchError(this.handleErrors.bind(this))
      )
  }


  private handleErrors(error: HttpErrorResponse) {
    const {message} = error.error;
    this._error$.next(message);
    throw error;
  }
}
