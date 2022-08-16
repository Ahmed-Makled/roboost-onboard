import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../shared/shared.module';

export const routes: Routes = [
  {path:'',component:IndexComponent},
]

@NgModule({
  declarations: [
    IndexComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),SharedModule
  ],
})

export class ByDateModule { }
