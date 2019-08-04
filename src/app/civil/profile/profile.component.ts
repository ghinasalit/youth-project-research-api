import {Component, OnInit} from '@angular/core';
import {AppService} from '../../app.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    public collapsed = false;
    isMyPaper = true;
    constructor(public _appService: AppService) {
    }


    showMyPapers() {
        this.isMyPaper = true;

        // let myDiv = document.getElementsByClassName('line-paper');
        // // myDiv.style.border = '0px solid #FDD97A';
        // myDiv.style.color = 'orange';
    }

    shoBookmarks() {

        this.isMyPaper = false;

    }

    ngOnInit() {
    }

}
