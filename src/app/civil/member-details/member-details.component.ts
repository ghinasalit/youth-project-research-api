import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';
import {User} from '../../../classes/user';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  collapsed = false;
  hide = true;
  profileForm: FormGroup;
  user = new User();
  university = new FormControl('', [Validators.required]);
  selectFormControl = new FormControl('', Validators.required);
  public  animals  = [
    {name: 'Dog', sound: 'Woof!'},
    {name: 'Cat', sound: 'Meow!'},
    {name: 'Cow', sound: 'Moo!'},
    {name: 'Fox', sound: 'Wa-pa-pa-pa-pa-pa-pow!'},
  ];
  constructor( private fb: FormBuilder,
               public dialog: MatDialog,
               public _appService: AppService) {

    this.profileForm = fb.group({

      'l_name': [null, Validators.required],
      'f_name': [null, Validators.required],
      'password': [null, Validators.required],
      'FileName': ['',  Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(1500)])],
      'File': [''],
    });
  }


  // login(){
  //
  //   this._appService.api.getMembersService()
  //       .subscribe(response => {
  //
  //         this.result = response;
  //
  //         if (this.result.code === 1) {
  //           // this.router.navigate(['/']);
  //
  //         } else {
  //           console.log(this.result.msg);
  //           this.toaster.error(this.result.msg, 'Failed');
  //
  //         }
  //
  //       });
  //
  // }

  ngOnInit() {

  //   $(window).scroll(function () {
  //     var scrollTop = $(window).scrollTop();
  //     if (scrollTop > 800) {
  //       $('.social').css('position', 'fixed').css('top', '0');
  //     } else {
  //       $('.social').css('position', 'initial').css('top', '0');
  //     }
  //   });
  }

}
