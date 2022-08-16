import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { AddressConfigurationComponent } from './_partial/address-branch-configuration/index/index.component';
import { OrderConfigurationComponent } from './_partial/order-branch-configuration/index/index.component';
import { OrderPriorityComponent } from './_partial/order-priority/index/index.component';
import { QRCodeComponent } from './_partial/generate-qr-code/index/index.component';
import { TripConfigurationComponent } from './_partial/trip-branch-configuration/index/index.component';


export const routes: Routes = [
  {path:':id',component:IndexComponent}
]
@NgModule({
  imports: [
    CommonModule,RouterModule.forChild(routes),SharedModule
  ],
  declarations: [
    IndexComponent,
    AddressConfigurationComponent,
    TripConfigurationComponent,
    OrderConfigurationComponent,
    OrderPriorityComponent,
    QRCodeComponent
  ] 
})
export class BranchProfileModule { }
