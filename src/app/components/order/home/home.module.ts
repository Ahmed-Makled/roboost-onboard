import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { OrderLayoutComponent } from '../layout/order-layout/order-layout.component';

export const routes: Routes = [
  {path:'recent-tasks',component:IndexComponent},
  {path:'archived',component:IndexComponent},
]

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),SharedModule
  ],
})

export class OrderHomeModule { }
