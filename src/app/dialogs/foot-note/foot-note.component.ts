import { Component, OnInit } from '@angular/core';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-foot-note',
  templateUrl: './foot-note.component.html',
  styleUrls: ['./foot-note.component.css']
})
export class FootNoteComponent implements OnInit {

  constructor(
    public _appService: AppService) { }

  ngOnInit() {
  }

}
