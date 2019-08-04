import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../classes/user';
import {AppService} from '../../app.service';
import {HttpEventType} from '@angular/common/http';
import {MatDialog} from '@angular/material';
import {ProfileInfoComponent} from '../../dialogs/profile-info/profile-info.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  collapsed = false;
  result: any;
  @ViewChild('File') InputFile;
  UploadFile: File;
  registerForm: FormGroup;
  hide = true;
  user = new User();
  constructor( private fb: FormBuilder,
               public dialog: MatDialog,
               public _appService: AppService) {

    this.registerForm = fb.group({

      'l_name': [null, Validators.required],
      'f_name': [null, Validators.required],
      'email': [null, [Validators.required]],
      // 'email': [null, [Validators.required, Validators.pattern(this._appService.isEmail)]],
      'username': [null, Validators.required],
      'password': [null, Validators.required],
      // 'FileName': ['',  Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(1500)])],
      // 'File': [''],
    });
  }

  l_name = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required]);
  f_name = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  username = new FormControl('', [Validators.required]);



  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }
  openDialog(): void {
    this.user.first_name = this.registerForm.controls.f_name.value;
    this.user.last_name = this.registerForm.controls.l_name.value;
    this.user.email = this.registerForm.controls.email.value;
    this.user.password = this.registerForm.controls.password.value;
    this.user.username = this.registerForm.controls.username.value;
    const dialogRef = this.dialog.open(ProfileInfoComponent, {
      // width: '350px',
      // data: "Do you confirm the deletion of this data?"

    });
    dialogRef.componentInstance.user = this.user;
    // dialogRef.afterClosed().subscribe(result => {
    //   if(result) {
    //     console.log('Yes clicked');
    //     // DO SOMETHING
    //   }
    // });
  }

  upload(value){
    const file = this.InputFile.nativeElement;
    if (file.files && file.files[0]) {
      this.UploadFile = file.files[0];
    }
    var formData = new FormData();
    // formData.append('username', '');
    // formData.append('file', this.UploadFile);
    // formData.append('session_id', 'f7951c9df7ca21b0190d3338f');
    // formData.append('description', '11');
    // formData.append('location', '11');
    // formData.append('university', '11');
    // formData.append('phone', '11');
    // formData.append('domain', '11');
    // console.log(this.UploadFile);


    formData.append('file', this.UploadFile);
    formData.append('session_id', 'f7951c9df7ca21b0190d3338f');
    formData.append('description', '11');
    formData.append('discipline', '11');
    formData.append('tag', '11');
    formData.append('permission', '11');
    formData.append('language', '11');
    formData.append('title', '11');
    formData.append('status', '1');
    console.log(this.UploadFile);

    this._appService.api.uploadImageService(formData)
        .subscribe(response => {
          // if(event.type === HttpEventType.UploadProgress){
          //   this.UploadProgress = Math.round((event.loaded / event.total) * 100);
          //   console.log(this.UploadProgress);
          // } else if(event.type === HttpEventType.Response) {
          //   let response: any;
          //   response = event.body;
          //   console.log(response);
          // }
        }
    );



  }

  ngOnInit() {

    // $(() => {
    //   $('.dropify').dropify();
    // });
  }

}
