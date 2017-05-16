import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecommendPage } from './recommend';

@NgModule({
  declarations: [
    RecommendPage,
  ],
  imports: [
    IonicPageModule.forChild(RecommendPage),
  ],
  exports: [
    RecommendPage
  ]
})
export class RecommendPageModule {}
