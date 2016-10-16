import { Component, ViewChild, ElementRef } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { LevelDetailsPage } from '../level-details/level-details';

@Component({
  templateUrl: 'home.html',
  styles: [
      'button { position:absolute; border-radius:50%; border:solid 1px;}'
  ]

})
export class HomePage {
    private _size:    number;
    private _tension: number;
    selectedLevel:    any;
    containerWidth:   number;
    containerHeight:  number;
    
    levels: Array<{ id: number, title: string, x: number, y: number }>;

    //@ViewChild("canvas") canvas: ElementRef; 
   constructor( public navCtrl: NavController, public navParams: NavParams ) {   

   }
   
   
   ngAfterViewInit() { // wait for the view to init before using the element
       this.containerWidth  = document.getElementById("content").offsetWidth;
       this.containerHeight = document.getElementById("content").offsetHeight;
       
       this.selectedLevel = this.navParams.get( 'level' );
       
       this._size  = 250;
       this.levels = [];
       
       var xPos = 0;
       var yPos = 0;
       
       for ( let i = 1; i <= 6; i++ ) {
           this.levels.push({
               id: i,
               title: 'Level ' + i,
               x: xPos,
               y: yPos
           });
           if ( i == 5 ) {
               xPos = this.containerWidth - 50;
               yPos = this.containerHeight - 100;
           } else {
               xPos += 60;
               yPos += 20;
           }

       }

/*
      let context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d");
      context.fillStyle = 'blue';
      context.fillRect(10, 10, 250, 250);
*/      
    }

   levelTapped(event, level) {
     this.navCtrl.push(LevelDetailsPage, {
       level: level
     });
   }
}
