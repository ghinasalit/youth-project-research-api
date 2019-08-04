import {Component, Input, OnInit} from '@angular/core';
import {AppService} from '../../app/app.service';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
    @Input() Breadcrumb: string[];

    constructor(public _appService: AppService) {
    }

    printThis() {
        window.print();
    }

    ngOnInit() {

    }

}
