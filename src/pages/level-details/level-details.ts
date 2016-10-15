import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'level-details.html'
})

export class LevelDetailsPage {
    selectedLevel: any;

    constructor( public navCtrl: NavController, public navParams: NavParams ) {
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedLevel = navParams.get('level');
    }
}
