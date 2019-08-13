import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../../app.service';
import {Paper} from '../../../classes/paper';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
    selector: 'app-edit-paper',
    templateUrl: './edit-paper.component.html',
    styleUrls: ['./edit-paper.component.css']
})
export class EditPaperComponent implements OnInit {
    paperForm: FormGroup;
    collapsed = false;
    paper = new Paper();
    result: any;
    details: any;
    allTags: any = [];
    selected: string[] = [];
    myControl = new FormControl();
    toppings = new FormControl();
    disciplines: any = [];
    // myControl = new FormControl();
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;
    title = new FormControl('', [Validators.required]);
    discipline = new FormControl('', [Validators.required]);
    description = new FormControl('', [Validators.required]);
    tags = new FormControl('', [Validators.required]);
    lang = new FormControl('', [Validators.required]);

    constructor(private fb: FormBuilder,
                public _appService: AppService,
                private route: ActivatedRoute) {

        this.paperForm = fb.group({
            'title': [null, Validators.required],
            'discipline': [null, Validators.required],
            'description': [null, Validators.required],
            'tags': [null, Validators.required],
            'lang': [null, Validators.required],

        });
    }

    editPaper() {

        this.paper.title = this.paperForm.controls.title.value;
        this.paper.discipline = this.paperForm.controls.discipline.value;
        this.paper.description = this.paperForm.controls.description.value;
        this.paper.tags = this.paperForm.controls.tags.value;
        this.paper.lang = this.paperForm.controls.lang.value;
        this._appService.api.editPaperService(this.paper)
            .subscribe(response => {

                this.result = response;

                if (this.result.code === 1) {

                } else {

                }

            });
    }


    getPaper() {
        this._appService.api.getPaperService(this.paper)
            .subscribe(response => {

                this.result = response;
                this.result.data.tags.forEach(tag => {
                    this.selected.push(tag.tag_id);
                });
                this.paperForm.get('tags').setValue(this.selected);

                if (this.result.code === 1) {
                    this.details = this.result.data;
                    this.paperForm.get('title').setValue(this.details.title);
                    this.paperForm.get('discipline').setValue(this.details.discipline_id);
                    this.paperForm.get('description').setValue(this.details.description);
                    this.getTags();


                } else {

                }

            });
    }

    getTags() {
        this._appService.api.getTagsService()
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    this.allTags = result.data;
                    // result.data.forEach(item => {
                    //     this.details.tags.forEach(tag => {
                    //         if (item.tag_id === tag.tag_id) {
                    //             item['check'] = true;
                    //             console.log(item);
                    //             this.allTags.push(item);
                    //         } else {
                    //             item['check'] = false;
                    //             this.allTags.push(item);
                    //             console.log(this.allTags);
                    //
                    //         }
                    //     });
                    // });


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
                    this.disciplines = result.data;
                } else {

                }

            });

    }

    ngOnInit() {
        this.getDisciplines();

        this.route.params.subscribe(params => {
            this.paper.paper_id = params['id'];
            this.getPaper();

        });

        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filter(value))
            );
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.disciplines.filter(option => option.toLowerCase().includes(filterValue));
    }

}
