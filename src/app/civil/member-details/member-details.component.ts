import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';
import {User} from '../../../classes/user';
import {AppService} from '../../app.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-member-details',
    templateUrl: './member-details.component.html',
    styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
    collapsed = false;
    hide = true;
    result: any;
    memberDetails: any;
    universities: any = [];
    profileForm: FormGroup;
    user = new User();
    imageChangedEvent: any = '';
    croppedImage: any = 'assets/img/avatar_default.PNG';
    university = new FormControl('', [Validators.required]);
    f_name = new FormControl('', [Validators.required]);
    l_name = new FormControl('', [Validators.required]);


    constructor(private fb: FormBuilder,
                public dialog: MatDialog,
                public _appService: AppService,
                private toaster: ToastrService,
                public router: Router,
    ) {

        this.profileForm = fb.group({

            'l_name': [null, Validators.required],
            'f_name': [null, Validators.required],
            'password': '',
            'university': [null, Validators.required],
            'job': '',
            'phone': '',
            'location': '',
            'linkedin': '',
            'description': '',
            'File': '',
        });
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    imageCropped(image: any) {
        this.croppedImage = image;
    }

    imageLoaded() {
        // console.log('loaded');
    }

    loadImageFailed() {
        // console.log('failed');
    }


    getMemberLoggedin() {
        this._appService.api.getMemberLoggedinService()
            .subscribe(response => {

                this.result = response;
                if (this.result.code === 1) {
                    this.memberDetails = this.result.data;
                    this.profileForm.get('f_name').setValue(this.memberDetails.first_name);
                    this.profileForm.get('l_name').setValue(this.memberDetails.last_name);
                    this.profileForm.get('university').setValue(this.memberDetails.university_id);
                    this.profileForm.get('job').setValue(this.memberDetails.domain);
                    this.profileForm.get('phone').setValue(this.memberDetails.phone);
                    this.profileForm.get('location').setValue(this.memberDetails.location);
                    this.profileForm.get('linkedin').setValue(this.memberDetails.linkedin);
                    this.profileForm.get('description').setValue(this.memberDetails.description);
                    this.croppedImage = this._appService.api.api.imgURL + this.memberDetails.avatar ;
                } else {
                    this._appService.clearLocalStorage();
                }

            });

    }

    editProfile() {
        this.user.university = this.profileForm.controls.university.value;
        this.user.first_name = this.profileForm.controls.f_name.value;
        this.user.last_name = this.profileForm.controls.l_name.value;
        this.user.job = this.profileForm.controls.job.value ? this.profileForm.controls.job.value : '';
        this.user.location = this.profileForm.controls.location.value ? this.profileForm.controls.location.value : '';
        this.user.phone = this.profileForm.controls.phone.value ? this.profileForm.controls.phone.value : '';
        this.user.Linkedin = this.profileForm.controls.linkedin.value ? this.profileForm.controls.linkedin.value : '';
        this.user.description = this.profileForm.controls.description.value ?  this.profileForm.controls.description.value : '';
        this.user.avatar = this.croppedImage.base64 ? this.croppedImage.base64 : '';
        this.user.password = this.profileForm.controls.password.value ? this.profileForm.controls.password.value : '';


        this._appService.api.updateProfileService(this.user)
            .subscribe(response => {

                this.result = response;

                if (this.result.code === 1) {
                    this.toaster.success(this.result.msg, 'Success');

                } else {

                    this.toaster.error(this.result.msg, 'Failed');

                }

            });

    }


    getUniversities() {
        this._appService.api.getUniversitiesService()
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    this.universities = result.data;
                } else {

                }
                window.scrollTo( 0, 0);

            });

    }


    ngOnInit() {
        window.scrollTo( 0, 0);



        this.getMemberLoggedin();
        this.getUniversities();


    }

}
