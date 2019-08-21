import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {AppService} from '../../app.service';
import {Paper} from '../../../classes/paper';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-request',
    templateUrl: './request.component.html',
    styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
    public paper_id: number;
    paper = new Paper();
    requestForm: FormGroup;
    private trans = {
        SendRequestMSG: null,
        Success: null,
        Failed: null,
        FailedMSG: null,
    };


    constructor(public dialogRef: MatDialogRef<RequestComponent>,
                private _appService: AppService,
                private fb: FormBuilder,
                private translate: TranslateService,
                private toaster: ToastrService) {

        this.requestForm = fb.group({


            'description': [null, Validators.required],

        });

        translate.get(['_SendRequestMSG'   , '_Success', '_Failed', '_FailedMSG']).subscribe(res => {

            this.trans.Failed = res._Failed;
            this.trans.FailedMSG = res._FailedMSG;
            this.trans.SendRequestMSG = res._SendRequestMSG;
            this.trans.Success = res._Success;
        });

        translate.onLangChange.subscribe(lang => {

            this.trans.Failed = lang.translate._Failed;
            this.trans.FailedMSG = lang.translate._FailedMSG;
            this.trans.SendRequestMSG = lang.translate._SendRequestMSG;
            this.trans.Success = lang.translate._Success;

        });


    }

    sendRequest() {
        this.paper.message = this.requestForm.controls.description.value;
        this.paper.paper_id = this.paper_id;



        this._appService.api.sedRequsetService(this.paper)
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    this.toaster.success( this.trans.SendRequestMSG, '');
                    this.dialogRef.close();
                } else {
                    this.toaster.error(this.trans.FailedMSG, '');
                    this.dialogRef.close();


                }
            });
    }


    ngOnInit() {
    }

}
