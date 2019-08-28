import {Component, OnInit} from '@angular/core';
import {AppService} from '../../app.service';
import {Shared} from '../../../classes/shared';
import {Paper} from '../../../classes/paper';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {PaperComponent} from '../../dialogs/paper/paper.component';
import {TranslateService} from '@ngx-translate/core';
import {RequestComponent} from '../../dialogs/request/request.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    collapsed = false;
    data = new Shared();
    result: any;
    isMyPaper = true;
    username: string;
    Counties: any;
    years: any;
    Disciplines: any;
    member: any = [];
    papers: any = [];
    paper = new Paper();
    searchForm: FormGroup;
    statistics: any;
    throttle = 300;
    member_id: any;
    scrollDistance = 1;
    scrollUpDistance = 2;
    isOneRecognized = false;
    private trans = {
        SavePaperMSG: null,
        DeletePaperMSG: null,
        Success: null,
        Failed: null,
        FailedMSG: null,
    };

    constructor(public dialog: MatDialog,
                public fb: FormBuilder,
                private route: ActivatedRoute,
                private toaster: ToastrService,
                private translate: TranslateService,
                private router: Router,
                public _appService: AppService) {


        this.data.page = 0;
        this.data.size = 6;
        this.paper.size = 6;
        this.paper.page = 0;
        this.searchForm = fb.group({

            'search': '',
        });


        translate.get(['_SavePaperMSG', '_DeletePaperMSG', '_Success', '_FailedMSG']).subscribe(res => {

            this.trans.FailedMSG = res._FailedMSG;
            this.trans.SavePaperMSG = res._SavePaperMSG;
            this.trans.DeletePaperMSG = res._DeletePaperMSG;
            this.trans.Success = res._Success;
        });

        translate.onLangChange.subscribe(lang => {
          this._appService.getCounties();
            this.trans.FailedMSG = lang.translations._FailedMSG;
            this.trans.SavePaperMSG = lang.translations._SavePaperMSG;
            this.trans.DeletePaperMSG = lang.translations._DeletePaperMSG;
            this.trans.Success = lang.translations._Success;

        });

    }


    showBookmarks() {

        this.isMyPaper = false;
        this.data.page = 0;
        this.getBookmarks();

    }

    showUserPapers() {

        this.isMyPaper = true;
        this.data.page = 0;
        this.getPapersByMember();

    }

    getPapersByMember() {
        this.isMyPaper = true;
        this.paper.page = 0;
        if (this.data.page === 0) {
            this.papers = [];
        }
        this._appService.api.getPapersByMemberService(this.data)
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

    getBookmarks() {
        this.paper.page = 0;
        if (this.data.page === 0) {
            this.papers = [];
        }
        this._appService.api.getBbookmarksService(this.data)
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

    get_member_by_username() {
        this._appService.api.getMemberService(this.data)
            .subscribe(response => {

                this.result = response;
                if (this.result.code === 1) {
                    this.member = this.result.data;
                    //console.log(this.member);
                    this.getOneRecognized(this.member.country, this.member.member_id);

                } else {

                }

            });

    }

    getOneRecognized(country, member_id) {

        this.data.country = country;
        this._appService.api.getOneRecognizedService(this.data)
            .subscribe(response => {
                let result: any;
                result = response;
                if (result.code === 1) {

                    if (member_id === result.data.member_id && result.data.views !== 0) {
                        this.isOneRecognized = true;
                        this.data.country = '';
                    }
                    this.data.country = '';

                } else {

                }

            });


    }


    filter() {
        this.paper.page = 0;
        this.searchPaperByMember();

    }

    searchPaperByMember() {
        this.paper.keyword = this.searchForm.controls.search.value;
        this.paper.username = this.data.username;

        this.data.page = 0;
        if (this.paper.page === 0) {
            this.papers = [];
        }

        this._appService.api.searchPaperByMemberService(this.paper)
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

    savePaper(paper_id) {
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

                    this.toaster.success(this.trans.SavePaperMSG, '');
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
                    this.toaster.success(this.trans.DeletePaperMSG, 'success');

                } else {
                    this._appService.registerPageTitle = 1;
                    this.router.navigate(['/register']);
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

    isHaveAccess(paper, action) {
        this._appService.api.isHaveAccessService(paper)
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {

                    if (action === 'view') {
                        const dialogRef = this.dialog.open(PaperComponent, {});
                        dialogRef.componentInstance.paper = paper;
                        this.addView(paper);
                    } else {
                        this.downloadPaper(paper);
                        this.addDownloadPaper(paper);
                    }
                } else {
                    const dialogRef = this.dialog.open(RequestComponent, {});
                    dialogRef.componentInstance.paper_id = paper.paper_id;
                }
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

    viewPaper(paper) {
        if (this._appService.roll) {
            if (paper.permission === 1 || paper.username === this.username) {
                const dialogRef = this.dialog.open(PaperComponent, {});
                dialogRef.componentInstance.paper = paper;
                if (this.username != paper.username) {
                    this.addView(paper);
                }

            } else if (paper.permission === 0) {

                this.isHaveAccess(paper, 'view');
            }
        } else {
            this._appService.registerPageTitle = 3;
            this._appService.goPapers = true;
            this.router.navigate(['/register']);
        }
    }

    // downloadPaper(paper) {
    //     this._appService.api.downloadNoteReceipt(paper.file).subscribe(res => {
    //         var newBlob = new Blob([res], {type: 'application/pdf'});
    //
    //         if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //             window.navigator.msSaveOrOpenBlob(newBlob);
    //             return;
    //         }
    //         // For other browsers:
    //         // Create a link pointing to the ObjectURL containing the blob.
    //         const data = window.URL.createObjectURL(newBlob);
    //
    //         var link = document.createElement('a');
    //         link.href = data;
    //         link.download = paper.title + '.pdf';
    //         // this is necessary as link.click() does not work on the latest firefox
    //         link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));
    //
    //         setTimeout(function () {
    //             // For Firefox it is necessary to delay revoking the ObjectURL
    //             window.URL.revokeObjectURL(data);
    //         }, 100);
    //
    //     }, error => {
    //         console.log(error);
    //     });
    // }


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
        if (this.result.data.length === 6 && this.paper.keyword === '' && this.paper.year === '' && this.paper.discipline === '' && this.paper.country === '' && this.paper.lang === '') {
            this.getPapersByMember();
        } else if (this.result.data.length == 6 && (this.paper.keyword != '' || this.paper.year != '' || this.paper.discipline != '' || this.paper.country != '' || this.paper.lang != '')) {

            this.searchPaperByMember();
        }

    }

    ngOnInit() {

        this._appService.active = 5;

        window.scrollTo(0, 0);
        this.member_id = localStorage.getItem('id');
        this.route.params.subscribe(params => {
            this.data.username = params['id'];
            this.get_member_by_username();
            this.getPapersByMember();
        });
        this._appService.countiesNotifier.subscribe(data => {
            this.Counties = data;
        });
        this._appService.disciplinesNotifier.subscribe(data => {
            this.Disciplines = data;
        });
        this._appService.yearsNotifier.subscribe(data => {
            this.years = data;
        });
        this.username = localStorage.getItem('username');


    }


}
