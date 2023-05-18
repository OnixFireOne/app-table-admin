import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ContentComponent } from './table-page/content/content.component';
import { MenuComponent } from './header/menu/menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import { TableComponent } from './table-page/content/table/table.component';
import { AddComponentDirective } from './directive/add-component.directive';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {HttpClientModule} from '@angular/common/http';
import {MatLineModule, MatRippleModule} from '@angular/material/core';
import localeRu from '@angular/common/locales/ru';
import {DecimalPipe, registerLocaleData} from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { DialogContentCoinDialogComponent } from './table-page/content/dialog/dialog-content-coin-dialog/dialog-content-coin-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import { DrawerSlidRefDirective } from './directive/drawer-slid-ref.directive';
import { BaseDestroyDirective } from './directive/base-destroy.directive';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';

import { SidenavEndComponent } from './table-page/sidenav/sidenav-end/sidenav-end.component';
import { FooterComponent } from './table-page/content/footer/footer.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import { DialogSettingsCardComponent } from './table-page/sidenav/sidenav-end/dialog-settings-card/dialog-settings-card.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { DialogSettingsBlockComponent } from './table-page/sidenav/sidenav-end/dialog-settings-block/dialog-settings-block.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { TablePageComponent } from './table-page/table-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatToolbarModule} from '@angular/material/toolbar';
import { DialogImagesComponent } from './table-page/sidenav/sidenav-end/dialog-settings-card/dialog-images/dialog-images.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DialogAlertComponent } from './table-page/content/dialog/dialog-alert/dialog-alert.component';




registerLocaleData(localeRu,'fr')

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    MenuComponent,
    TableComponent,
    AddComponentDirective,
    DialogContentCoinDialogComponent,
    DrawerSlidRefDirective,
    BaseDestroyDirective,
    SidenavEndComponent,
    FooterComponent,
    DialogSettingsCardComponent,
    DialogSettingsBlockComponent,
    TablePageComponent,
    LoginPageComponent,
    DialogImagesComponent,
    DialogAlertComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatTableModule,
    MatSortModule,
    HttpClientModule,
    MatRippleModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSidenavModule,
    MatCardModule,
    MatListModule,
    MatSlideToggleModule,
    FormsModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatBadgeModule,
    MatLineModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    DragDropModule,
    MatRadioModule,
    MatToolbarModule,
    OverlayModule,
    MatProgressSpinnerModule,

  ],
  providers: [DecimalPipe, MatDrawer, MatSnackBar,
    {
      provide: LOCALE_ID,
      useValue: 'fr'
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
