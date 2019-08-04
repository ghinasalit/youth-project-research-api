import {Component, OnInit} from '@angular/core';
import {ProfileInfoComponent} from '../../dialogs/profile-info/profile-info.component';
import {MatDialog} from '@angular/material';
import {PaperComponent} from '../../dialogs/paper/paper.component';
import {AppService} from '../../app.service';

@Component({
    selector: 'app-papers',
    templateUrl: './papers.component.html',
    styleUrls: ['./papers.component.css']
})
export class PapersComponent implements OnInit {
    collapsed = false;

    constructor(public dialog: MatDialog,
                public _appService: AppService) {
    }

    viewPaper() {
        const dialogRef = this.dialog.open(PaperComponent , {
            // width: '350px',
            // data: "Do you confirm the deletion of this data?"
        });
    }


    ngOnInit() {
    }

}
