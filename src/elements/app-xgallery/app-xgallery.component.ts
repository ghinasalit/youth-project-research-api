import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-xgallery',
    templateUrl: './app-xgallery.component.html',
    styleUrls: ['./app-xgallery.component.css'],
    animations: [
        trigger('fadeInOut', [
            state('void', style({
                opacity: 0
            })),
            transition('void => *', animate(1000)),
        ]),
    ]
})
export class AppXgalleryComponent implements OnInit {
    @Input() imageUrls: any;
    index;
    lastIndex;

    constructor() {
    }

    next() {
        this.index = this.index + 1;
    }

    prev() {
        this.index = this.index - 1;
    }

    ngOnInit() {
        this.index = 0;
        this.lastIndex = this.imageUrls.length - 1;
    }

}
