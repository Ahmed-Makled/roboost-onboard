import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { ReceiptComponent } from '../../shared/component/receipt/index/receipt.component';




export const routes: Routes = [
  {path:':code',component:IndexComponent},
  {path:'print-receipt/:code',component:ReceiptComponent},
  {path:'preview-receipt/:code',component:ReceiptComponent},
]

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),SharedModule
  ],
})
export class OrderDetailsModule { }
