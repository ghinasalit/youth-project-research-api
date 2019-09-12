import {Component, OnInit} from '@angular/core';
import {AppService} from '../../app.service';
import {MatDialog} from '@angular/material';
import {FootNoteComponent} from '../../dialogs/foot-note/foot-note.component';
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

    constructor(
      public _appService: AppService,
      public dialog: MatDialog) {
    }

  openDialog() {
    const dialogRef = this.dialog.open(FootNoteComponent);

  }
    ngOnInit() {
    }
}
