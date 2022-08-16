import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';
import { RankingLayoutComponent } from '../components/ranking/layout/layout.component';
import { AuthGuardService } from '../guards/auth-guard.service ';
import { PageEnum } from '../enum/page.enum';

export const routes: Routes = [
  {
    path: '',
    component: RankingLayoutComponent,
    children: [
      {
        path: 'delivery-agents',
        children:[
          {
            path: '',
            loadChildren: () => import('../components/ranking/agent/home/ranking-agent.module').then(m => m.RankingAgentModule),
          },
          {
            path: 'leader-board',
            loadChildren: () => import('../components/ranking/agent/leader-board/leader-board.module').then(m => m.LeaderBoardModule),
          }
        ],
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Ranking_Board_Delivery_Agents] }
      },


    ]
  },
]

@NgModule({
  declarations: [RankingLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), SharedModule
  ],
})

export class RankingRoutingModule { }
