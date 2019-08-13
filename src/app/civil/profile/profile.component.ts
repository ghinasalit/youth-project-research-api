import {Component, OnInit} from '@angular/core';
import {AppService} from '../../app.service';
import {Shared} from '../../../classes/shared';
import {Paper} from '../../../classes/paper';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {PaperComponent} from '../../dialogs/paper/paper.component';

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
    isOneRecognized = false;


    constructor(public dialog: MatDialog,
                public fb: FormBuilder,
                private route: ActivatedRoute,
                private toaster: ToastrService,
                private router: Router,
                public _appService: AppService) {


        this.data.page = 0;
        this.data.size = 6;
        this.paper.size = 6;
        this.paper.page = 0;
        this.searchForm = fb.group({


            'search': '',

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
                    }
                    this.data.country = '';

                } else {

                }

            });


    }

    getCounties() {
        this._appService.api.getCountriesService()
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    this.Counties = result.data;
                } else {

                }

            });

    }

    get_years() {
        this._appService.api.getYearsService()
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    this.years = result.data;
                } else {

                }

            });

    }

    getDisciplines() {
        this._appService.api.getDisciplinesService()
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    this.Disciplines = result.data;
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

                    this.toaster.success('saved the research paper successfully', 'success');
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
                    this.toaster.success('delete saved the research paper successfully', 'success');

                } else {
                    this._appService.registerPageTitle = 1;
                    this.router.navigate(['/register']);
                }

            });
    }

    viewPaper(paper) {
        if (this._appService.roll) {
            if (paper.permission === 1) {
                const dialogRef = this.dialog.open(PaperComponent, {});
                dialogRef.componentInstance.paper = paper;
                if(this.username != paper.username) {
                    this._appService.api.addViewService(paper)
                        .subscribe(response => {
                            let result;
                            result = response;
                            if (result.code === 1) {

                            }
                        });
                }

            } else {

            }
        } else {
            this._appService.registerPageTitle = 3;
            this.router.navigate(['/register']);
        }
    }


    download(paper) {
        if (this._appService.roll) {

            if (paper.permission === 1) {
                this._appService.api.downloadNoteReceipt(paper.filename).subscribe(res => {
                    console.log(res);
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

                if(this.username != paper.username) {
                    this._appService.api.addDownloadService(paper)
                        .subscribe(response => {
                            let result;
                            result = response;
                            if (result.code === 1) {

                            }
                        });
                }
            } else {

            }
        } else {
            this._appService.registerPageTitle = 3;
            this.router.navigate(['/register']);
        }
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.data.username = params['id'];
            this.get_member_by_username();
            this.getPapersByMember();
        });
        this.getCounties();
        this.getDisciplines();
        this.get_years();
        this.username = localStorage.getItem('username');



    }


}
