import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';
import { AuthGuardService } from '../guards/auth-guard.service ';
import { PageEnum } from '../enum/page.enum';


export const routes: Routes = [
  {
    path:'',
    // component:OrderLayoutComponent,
    children:[
      {
        path:'',
        loadChildren: () => import('../components/broadcast/broadcast-home.module').then(m => m.BroadCastModule),
      },
    ],
    canActivate: [AuthGuardService], data: { pageList: [PageEnum.Broadcast] }
  },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),SharedModule
  ],
})

export class BroadCastRoutingModule { }
