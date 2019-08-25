import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {PaperComponent} from '../../dialogs/paper/paper.component';
import {AppService} from '../../app.service';
import {Shared} from '../../../classes/shared';
import {Paper} from '../../../classes/paper';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {RequestComponent} from '../../dialogs/request/request.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-papers',
    templateUrl: './papers.component.html',
    styleUrls: ['./papers.component.css']
})
export class PapersComponent implements OnInit {
    collapsed = false;
    member_id: any;
    data = new Shared();
    result: any;
    username: string;
    result1: any;
    Counties: any;
    years: any;
    Disciplines: any;
    papers: any = [];
    paper = new Paper();
    searchForm: FormGroup;
    scrollDistance = 1;
    scrollUpDistance = 2;
    throttle = 300;
    isOneRecognized = false;
    statistics: any;
    private trans = {
        SavePaperMSG: null,
        DeletePaperMSG: null,
        Success: null,
        Failed: null,
        FailedMSG: null,
    };

    constructor(public dialog: MatDialog,
                public fb: FormBuilder,
                private router: Router,
                private translate: TranslateService,
                private toaster: ToastrService,
                public _appService: AppService) {

        this.data.page = 0;
        this.data.size = 6;
        this.paper.size = 6;
        this.paper.page = 0;
        this.searchForm = fb.group({
            'search': '',
        });

        translate.get(['_SavePaperMSG',  '_DeletePaperMSG' , '_Success', ]).subscribe(res => {

            this.trans.SavePaperMSG = res._SavePaperMSG;
            this.trans.DeletePaperMSG = res._DeletePaperMSG;
            this.trans.Success = res._Success;
        });

        translate.onLangChange.subscribe(lang => {

            this.trans.SavePaperMSG = lang.translations._SavePaperMSG;
            this.trans.DeletePaperMSG = lang.translations._DeletePaperMSG;
            this.trans.Success = lang.translations._Success;

        });


    }


    isHaveAccess(paper , action) {
        this._appService.api.isHaveAccessService(paper)
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {

                    if(action  === 'view'){
                        const dialogRef = this.dialog.open(PaperComponent, {});
                        dialogRef.componentInstance.paper = paper;
                        this.addView(paper);
                    }else{
                        this.downloadPaper(paper);
                        this.addDownloadPaper(paper);
                    }
                } else {
                    const dialogRef = this.dialog.open(RequestComponent, {});
                    dialogRef.componentInstance.paper_id = paper.paper_id;
                }
            });
    }

    addView(paper) {
        this._appService.api.addViewService(paper)
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {

                }
            });
    }

    viewPaper(paper) {
        if (this._appService.roll) {
            if (paper.permission === 1 || paper.username === this.username) {
                const dialogRef = this.dialog.open(PaperComponent, {});
                dialogRef.componentInstance.paper = paper;
                if (this.username != paper.username) {
                    this.addView(paper);
                }

            } else if (paper.permission === 0) {

                this.isHaveAccess(paper , 'view');
            }
        } else {
            this._appService.registerPageTitle = 3;
            this._appService.goPapers = true;
            this.router.navigate(['/register']);
        }
    }

    savePaper(paper_id) {

        console.log(paper_id);
        this.paper.paper_id = paper_id;
        this._appService.api.savePaperService(this.paper)
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    this.papers.forEach(item => {
                        if (item.paper_id === paper_id) {
                            item.saved = 1;
                        }
                    });

                    //this.toaster.success(this.trans.SavePaperMSG, '');
                } else {
                    this._appService.registerPageTitle = 1;
                    this.router.navigate(['/register']);
                }
            });
    }

    unsavePaper(paper_id) {
        this.paper.paper_id = paper_id;

        this._appService.api.unsavePaperService(this.paper)
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    this.papers.forEach(item => {
                        if (item.paper_id === paper_id) {
                            item.saved = 0;
                        }
                    });
                    //this.toaster.success(this.trans.DeletePaperMSG, '');

                } else {
                    this._appService.registerPageTitle = 1;
                    this.router.navigate(['/register']);
                }

            });
    }


    getPapers() {
        this.paper.page = 0;
        if (this.data.page === 0) {
            this.papers = [];
        }
        this._appService.api.getPapersService(this.data)
            .subscribe(response => {

                this.result = response;
                if (this.result.code === 1) {
                    this.result.data.forEach(item => {
                        this.papers.push(item);
                    });

                    this.data.page = this.data.page + 1;

                } else {

                }

            });

    }

    filter() {
        this.paper.page = 0;
        this.searchPapers();

    }

    searchPapers() {
        this.paper.keyword = this.searchForm.controls.search.value;

        this.data.page = 0;
        if (this.paper.page === 0) {
            this.papers = [];
        }

        this._appService.api.searchPapersService(this.paper)
            .subscribe(response => {
                this.result = response;
                if (this.result.code === 1) {
                    this.result.data.forEach(item => {
                        this.papers.push(item);
                    });

                    this.paper.page = this.paper.page + 1;

                } else {

                }

            });
    }

    getStatistics() {

        this._appService.api.getStatisticsService()
            .subscribe(response => {
                this.result1 = response;
                if (this.result1.code === 1) {
                    this.statistics = this.result1.data;

                } else {

                }

            });

    }


    downloadPaper(paper) {
        this._appService.api.downloadNoteReceipt(paper.file).subscribe(res => {
            var newBlob = new Blob([res], {type: 'application/pdf'});

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }
            // For other browsers:
            // Create a link pointing to the ObjectURL containing the blob.
            const data = window.URL.createObjectURL(newBlob);

            var link = document.createElement('a');
            link.href = data;
            link.download = paper.title + '.pdf';
            // this is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

            setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
            }, 100);

        }, error => {
            console.log(error);
        });
    }

    addDownloadPaper(paper) {
        this._appService.api.addDownloadService(paper)
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {

                }
            });
    }

    download(paper) {
        if (this._appService.roll) {

            if (paper.permission === 1 || paper.username === this.username) {

                this.downloadPaper(paper);
                if (this.username != paper.username) {
                    this.addDownloadPaper(paper);
                }
            } else if (paper.permission === 0) {
               this.isHaveAccess(paper , 'download');
            }
        } else {
            this._appService.goPapers = true;
            this._appService.registerPageTitle = 3;
            this.router.navigate(['/register']);
        }
    }

    loadmore() {

        if (this.result.data.length == 6 && this.paper.keyword == '' && this.paper.year == '' && this.paper.discipline == '' && this.paper.country == '' && this.paper.lang == '') {
            this.getPapers();
        } else if (this.result.data.length == 6 && (this.paper.keyword != '' || this.paper.year != '' || this.paper.discipline != '' || this.paper.country != '' || this.paper.lang != '')) {

            this.searchPapers();
        }

    }

    ngOnInit() {

        window.scrollTo(0,0);
        this._appService.active = 1;

        this.member_id = localStorage.getItem('id');
        this.username =   this.data.username = localStorage.getItem('username');
        this._appService.countiesNotifier.subscribe(data => {
            this.Counties = data;
        });

        this._appService.disciplinesNotifier.subscribe(data => {
            this.Disciplines = data;
        });
        this._appService.yearsNotifier.subscribe(data => {
            this.years = data;
        });
        this.getPapers();
        this.getStatistics();
    }

}
