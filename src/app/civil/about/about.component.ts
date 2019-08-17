import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AppService} from '../../app.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
    collapsed = false;
    myForm: FormGroup;

    constructor(public _appService: AppService) {
    }

    ngOnInit() {

        window.scrollTo(0 , 0);
    }

}
