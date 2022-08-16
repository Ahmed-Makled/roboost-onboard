import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryBreakComponent } from './index/index.component';


export const routes: Routes = [
  {path:'',component:DeliveryBreakComponent}
]
@NgModule({
  imports: [
    CommonModule,RouterModule.forChild(routes),SharedModule
  ],
  declarations: [DeliveryBreakComponent]
})
export class DeliverymanBreakModule { }
