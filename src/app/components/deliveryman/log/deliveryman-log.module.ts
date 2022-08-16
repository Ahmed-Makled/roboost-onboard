import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';

export const routes: Routes = [
  {path:'',component:IndexComponent}, 

]
@NgModule({
  imports: [
    CommonModule,RouterModule.forChild(routes),SharedModule
  ],
  declarations: [IndexComponent]
})
export class DeliverymanLogModule { }
