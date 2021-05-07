import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bounty-board',
    pathMatch: 'full'
  },
  {
    path: 'bounty-board',
    loadChildren: () => import('./bounty-board/bounty-board.module').then( m => m.BountyBoardPageModule)
  },
  {
    path: 'bounty-detail',
    loadChildren: () => import('./bounty-detail/bounty-detail.module').then( m => m.BountyDetailPageModule)
  },
  {
    path: 'bounty-claim',
    loadChildren: () => import('./bounty-claim/bounty-claim.module').then( m => m.BountyClaimPageModule)
  },
  {
    path: 'bounty-active',
    loadChildren: () => import('./bounty-active/bounty-active.module').then( m => m.BountyActivePageModule)
  }, 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
