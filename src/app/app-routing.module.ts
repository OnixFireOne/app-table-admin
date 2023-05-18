import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TablePageComponent} from './table-page/table-page.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {AuthGuard} from './service/auth.guard';

const routes: Routes = [
  {path: '', component: TablePageComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
