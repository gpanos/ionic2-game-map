import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { App } from './app.component';
import { HomePage } from '../pages/home/home';
import { LevelDetailsPage } from '../pages/level-details/level-details';

@NgModule({
  declarations: [
    App,
    HomePage,
    LevelDetailsPage
  ],
  imports: [
    IonicModule.forRoot(App)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    App,
    HomePage,
    LevelDetailsPage
  ],
  providers: []
})
export class AppModule {}
