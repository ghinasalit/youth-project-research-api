import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-slideshow',
    templateUrl: './app-slideshow.component.html',
    styleUrls: ['./app-slideshow.component.css']
})
export class AppSlideshowComponent implements OnInit {

    public imageSources = [
        {url: 'assets/images/banner1.jpg'},
        {url: 'assets/images/banner2.jpg'},
        {url: 'assets/images/banner3.jpg'}
    ];

    constructor() {
    }

    ngOnInit() {
    }

}
