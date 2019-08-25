import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {AppService} from '../../../app.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {ConditionsComponent} from '../../../dialogs/conditions/conditions.component';
import {TranslateService} from '@ngx-translate/core';

@Component({

    selector: 'app-permission-pepar',
    templateUrl: './permission-pepar.component.html',
    styleUrls: ['./permission-pepar.component.css']
})
export class PermissionPeparComponent implements OnInit {
    permissionForm: FormGroup;
    result: any;
    private trans = {
        UploadPaperMSG: null,
        Success: null,
        Failed: null,
        FailedMSG: null,
    };

    constructor(private fb: FormBuilder,
                private toaster: ToastrService,
                private  router: Router,
                public dialog: MatDialog,
                private translate: TranslateService,
                public  appService: AppService) {

        this.permissionForm = fb.group({
            'permission': [null, Validators.required],
            'conditions': [null, Validators.required]
        });

        translate.get(['_FailedMSG', '_UploadPaperMSG']).subscribe(res => {

            this.trans.Failed = res._Failed;
            this.trans.FailedMSG = res._FailedMSG;
            this.trans.UploadPaperMSG = res._UploadPaperMSG;
            this.trans.Success = res._Success;
        });

        translate.onLangChange.subscribe(lang => {

            this.trans.Failed = lang.translations._Failed;
            this.trans.FailedMSG = lang.translations._FailedMSG;
            this.trans.UploadPaperMSG = lang.translations._UploadPaperMSG;
            this.trans.Success = lang.translations._Success;

        });
    }


    sendPaper() {
        this.appService.paper.append('permission', this.permissionForm.controls.permission.value);
        this.appService.paper.append('status', '0');
        this.appService.api.sendPaperService(this.appService.paper)
            .subscribe(response => {

                this.result = response;

                if (this.result.code === 1) {
                    this.toaster.success(this.trans.UploadPaperMSG, '');

                    setTimeout(() => {
                        this.router.navigate(['/home' ]);
                    }, 2000);


                } else {
                    this.toaster.error(this.trans.FailedMSG, '');

                }

            });

    }

    openDialog() {
        const dialogRef = this.dialog.open(ConditionsComponent);

    }

    ngOnInit() {


        if(this.appService.fileName == ''){
            this.router.navigate(['/upload-paper']);

        }
    }

}
