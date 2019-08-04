import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {AppService} from '../../../app.service';

@Component({

  selector: 'app-permission-pepar',
  templateUrl: './permission-pepar.component.html',
  styleUrls: ['./permission-pepar.component.css']
})
export class PermissionPeparComponent implements OnInit {
  permissionForm: FormGroup;
  constructor(private fb: FormBuilder ,
              public  appService: AppService) {

    this.permissionForm = fb.group({
      // 'File': [''],
    });
  }

  ngOnInit() {
  }

}
