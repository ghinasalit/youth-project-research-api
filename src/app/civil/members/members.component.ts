import { Component, OnInit } from '@angular/core';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  collapsed = false;
  constructor(public _appService: AppService) { }

  ngOnInit() {
  }

}
