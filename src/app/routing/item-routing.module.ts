import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';

export const routes: Routes = [
  {
    path: '',
    // component:OrderLayoutComponent,
    children: [

    ]
  },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), SharedModule
  ],
})

export class ItemRoutingModule { }
