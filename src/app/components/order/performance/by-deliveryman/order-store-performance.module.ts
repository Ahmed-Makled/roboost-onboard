import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { OrderByDeliverymanComponent } from './by-deliveryman.component';

export const routes: Routes = [
  { path: '', component:OrderByDeliverymanComponent  },

]

@NgModule({
  declarations: [
    OrderByDeliverymanComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), SharedModule
  ],
})

export class OrderPerformanceDateModule { }
