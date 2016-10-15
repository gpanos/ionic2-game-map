import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { LevelDetailsPage } from '../level-details/level-details';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {
    selectedLevel: any;
    levels: Array<{ id: number, title: string }>;

   constructor( public navCtrl: NavController, public navParams: NavParams ) {
     // If we navigated to this page, we will have an item available as a nav param
     this.selectedLevel = navParams.get( 'level' );
     
     this.levels = [];
     for ( let i = 1; i < 11; i++ ) {
       this.levels.push({
         id: i,
         title: 'Level ' + i,
       });
     }
   }

   levelTapped(event, level) {
     this.navCtrl.push(LevelDetailsPage, {
       level: level
     });
   }
}
