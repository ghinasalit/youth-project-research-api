import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../classes/user';
import {AppService} from '../../app.service';
import {MatDialog} from '@angular/material';
import {ProfileInfoComponent} from '../../dialogs/profile-info/profile-info.component';
import {ToastrService} from 'ngx-toastr';
import {ConditionsComponent} from '../../dialogs/conditions/conditions.component';

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

    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                private toaster: ToastrService,
                public _appService: AppService) {

        this.registerForm = fb.group({

            'l_name': [null, Validators.required],
            'f_name': [null, Validators.required],
            'email': [null, [Validators.required, Validators.pattern(this._appService.isEmail)]],
            'password': [null, Validators.required],
          'conditions': [null, Validators.required]
        });
    }

    l_name = new FormControl('', [Validators.required]);
    email = new FormControl('', [Validators.required, Validators.email]);
    f_name = new FormControl('', [Validators.required]);
    password = new FormControl('', [Validators.required]);


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
        this._appService.api.isUserExistService(this.user)
            .subscribe(response => {
                    this.result = response;
                    if (this.result.code == 1) {
                        const dialogRef = this.dialog.open(ProfileInfoComponent, {});
                        dialogRef.componentInstance.user = this.user;

                    } else {
                        this.toaster.error(this.result.msg , '');
                    }
                });
    }

  openDialogCondition() {
    const dialogRef = this.dialog.open(ConditionsComponent);

  }


    ngOnInit() {
        window.scrollTo( 0, 0);

    }

}
