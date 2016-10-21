import { Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';

import { HomePage } from '../home/home';


@Component({
  templateUrl: 'level-details.html',
  styles: [
      'ion-card-header {text-align:center;font-size:26px;color:rgb(56,126,245);}',
      'ion-item {text-align:center;font-size:18px;color:rgb(56,126,245);}',
      '#progressbar-wrapper {background-color:rgba(56,126,245,0.5);border-radius:13px;padding:3px;}',
      '#progress {background-color:rgb(56,126,245);height:20px;border-radius:10px}'
  ]
})

export class LevelDetailsPage {
    selectedLevel : any;
    tap           : number = 0;
    step          : number;
    max           : number = 0;
    containerWidth: number;
    message       :string;
    
    constructor( public navCtrl: NavController, public navParams: NavParams, public alerCtrl: AlertController ) {
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedLevel = navParams.get('level');
        this.message = 'Tap me !!!';
    }
    
    ngAfterViewInit() { 
        var container      = document.getElementById('progressbar-wrapper');
        var containerWidth = document.defaultView.getComputedStyle(container,null)['width']
        containerWidth = containerWidth.replace(/\D/g,''); 
        
        this.containerWidth = parseInt( containerWidth );
        
        var numberOfTaps   = this.selectedLevel.id;
        this.step = Math.floor(this.containerWidth / numberOfTaps);
    }
    
    doAlert() {
        let alert = this.alerCtrl.create({
            title: 'Congrats!!',
            message: 'You finished ' + this.selectedLevel.title + '!' ,
            buttons: [{
                text: 'Ok',
                handler: data => {
                    this.navCtrl.setRoot(HomePage, {
                        id: this.selectedLevel.id
                    })
                }
            }],
            enableBackdropDismiss: false
        });
        
        alert.present();
        
    }
     
    
     tapEvent(e) {
        if ( this.max == this.selectedLevel.id ) {
            return false;
        } else if (this.max == this.selectedLevel.id - 1){
            this.tap = this.containerWidth - 6;        
            this.doAlert();
        } else {
                this.tap += this.step;
        }
        
        this.max++;
    }
    
}
