import { Component, ViewChild, ElementRef }  from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import { NavController, NavParams, Content, AlertController } from 'ionic-angular';

import { LevelDetailsPage } from '../level-details/level-details';

/*
 * * * * * * * * * * * * *
 * YOUR ATTENTION PLEASE *
 * * * * * * * * * * * * *
 *
 * Change the following constant 
 * to increase or decrease the
 * number of level ! ! ! !
 */
const NUMBER_OF_LEVELS = 15;

@Component({
  templateUrl: 'home.html',
  styles: [
      'button {z-index:2; position:absolute; border-radius:50%; width: 50px; height: 50px; -webkit-transform: translate3d(0,0,0);}',
      'canvas {z-index:1}',
      'span {z-index:3}'
  ]

})

export class HomePage {
    
    selectedLevel  : any;
    containerWidth : number;
    containerHeight: number;
    totalPoints    : number;
    activateLevelId: number = null;
    levels         : Array<{id: number, title: string, x: number, y: number, isActive:number}>;

    @ViewChild("canvas") canvas: ElementRef;     
    @ViewChild(Content) content: Content;

    constructor(
        public navCtrl   : NavController, 
        public navParams : NavParams, 
        public el        : ElementRef, 
        public alerCtrl  : AlertController,
        private sanitizer: DomSanitizer
    ) {
        this.totalPoints      = NUMBER_OF_LEVELS;
         this.activateLevelId = navParams.get('id');
    }
   
   ngAfterViewInit() { 
       this.generateLevels();
       
       var id     = this.activateLevelId;
       var canvas = this.canvas;
       var content = document.getElementById('content');
       if (this.activateLevelId) {
           for (let i = this.activateLevelId; i >= 1; i--) {
               content.scrollTop = canvas.nativeElement.offsetHeight - (this.levels[id].y + (25 * this.levels[id].id));
               this.levels[i].isActive = 1;
           }
       } else {
             document.getElementById('content').scrollTop = canvas.nativeElement.offsetHeight;
       }
       
    }
    
    fixScroll(maxHeight) {
        if (maxHeight > this.containerHeight){
            var scrollContent = this.el.nativeElement.querySelector('.scroll-content');
            scrollContent.style.height = maxHeight + 'px';
        }
    }
    
    generateLevels() {
        this.containerWidth  = document.getElementById('content').offsetWidth;
        this.containerHeight = document.getElementById('content').offsetHeight;
        this.selectedLevel   = this.navParams.get('level');
        this.levels          = [];
        
        var stepY = 80;
        
        if (this.containerHeight > this.totalPoints * stepY) {
            stepY = Math.floor(this.containerHeight / this.totalPoints);
        }
        
        // position first point
        var xPos = 50;
        var yPos = 50;
        // align left - right points
        var counter  = 2;
        var coords   = [];
        var isActive = 1;
        for (let i = 1; i <= this.totalPoints; i++) {
            this.levels.push({
                id   : i,
                title: 'Level ' + i,
                x    : xPos,
                y    : yPos,
                isActive: isActive                
            });
            
            isActive = 0;
            
            coords.push ({
                x: xPos,
                y: yPos
            })
            
            if (counter % 2 == 0) {
                xPos = this.containerWidth - 120 * this.getRandomInt(1, 3);
            } else {
                xPos = 50 * this.getRandomInt(1, 3);
            }

            yPos += stepY;

            counter++;
        }
        
        this.fixScroll(yPos);   
        this.setCanvas(this.canvas); 
        this.drawCurve(coords);
    }
    
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        
        return Math.floor(Math.random() * (max - min)) + min;
        
    }
    
   levelTapped(event, level) {
       if (!level.isActive) {
           var previousLevel = level.id - 1;
           let alert = this.alerCtrl.create({
               title: 'Sorry..',
               message: 'You should finish level ' + previousLevel + ' to continue!',
               buttons: ['Got it']
           });
           alert.present();
       } else {
           this.navCtrl.push(LevelDetailsPage, {
               level: level
           });
       }
   }
   
   setCanvas(canvas) {
       var scrollContent = this.el.nativeElement.querySelector('.scroll-content');

       canvas.nativeElement.style.width  = scrollContent.style.width;
       canvas.nativeElement.style.height = scrollContent.style.height;
       canvas.nativeElement.width        = canvas.nativeElement.offsetWidth;
       canvas.nativeElement.height       = canvas.nativeElement.offsetHeight;
   }
   
   setText(level) {
       var text = level.isActive ? level.id : '?';
       return this.sanitizer.bypassSecurityTrustHtml(text);
   }
   
   drawCurve(points) {
       var scrollContent = this.el.nativeElement.querySelector('.scroll-content');
       var ptsa = [];
       points.forEach(function(e) {
           e.y = scrollContent.offsetHeight - e.y - 25;
           e.x += 21;
           ptsa.push(e.x, e.y);
       });
       
       let ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext( '2d' );
       
       ctx.beginPath();
       this.drawLines(ctx, this.getCurvePoints( ptsa ));
       ctx.lineWidth = 10;
       ctx.strokeStyle = '#387ef5';
       ctx.stroke();
   }
   
   getCurvePoints(pts) {
       var tension       = 0.5;
       var numOfSegments = 16;

       var
        
       _pts = [], res = [],    // clone array
       x, y,           // our x,y coords
       t1x, t2x, t1y, t2y, // tension vectors
       c1, c2, c3, c4,     // cardinal points
       st, t, i;       // steps based on num. of segments
       
       // clone array so we don't change the original
       _pts = pts.slice(0);

       _pts.unshift(pts[1]);
       _pts.unshift(pts[0]);
       _pts.push(pts[pts.length - 2]);
       _pts.push(pts[pts.length - 1]);
       
       for (let i = 2; i < (_pts.length - 4); i += 2) {
           for (let t = 0; t <= numOfSegments; t++) {
               
               // calc tension vectors
               t1x = (_pts[i+2] - _pts[i-2]) * tension;
               t2x = (_pts[i+4] - _pts[i]) * tension;

               t1y = (_pts[i+3] - _pts[i-1]) * tension;
               t2y = (_pts[i+5] - _pts[i+1]) * tension;
               
               // calc step
               st = t / numOfSegments;
               
               // calc cardinals
               c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1; 
               c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
               c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st; 
               c4 = Math.pow(st, 3) - Math.pow(st, 2);

               // calc x and y cords with common control vectors
               x = c1 * _pts[i]    + c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
               y = c1 * _pts[i+1]  + c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

               //store points in array
               res.push(x);
               res.push(y);
           }
       }

       return res;
   }
   
   drawLines( ctx, pts ) {
       ctx.moveTo(pts[0], pts[1]);
       for (let i = 2; i < pts.length - 1; i += 2){
           ctx.lineTo(pts[i], pts[i+1]);
       } 
   }
   
}
