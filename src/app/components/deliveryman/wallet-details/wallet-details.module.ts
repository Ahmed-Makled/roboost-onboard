import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';

export const routes: Routes = [
  {path:'',component:IndexComponent}, 
  {path:'create',component:CreateComponent}, 
]
@NgModule({
  imports: [
    CommonModule,RouterModule.forChild(routes),SharedModule
  ],
  declarations: [IndexComponent,CreateComponent]
})
export class WalletDetailsModule { }
