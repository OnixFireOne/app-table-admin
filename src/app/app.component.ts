import {Component, OnInit} from '@angular/core';
import {StyleManager} from './service/style-manager.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'CryptoTableAjaxPopup';

  constructor(
    private readonly _styleManager: StyleManager,
  ) {}

  ngOnInit() {
    if(!!localStorage.getItem('dark-mod')) this._styleManager.toggleDarkTheme();
  }
}
