import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './page/login.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';


export const routes: Routes = [
  { path: '', component: LoginComponent }
]
@NgModule({
  
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,RouterModule.forChild(routes),SharedModule,
  ]
})
export class LoginModule { }