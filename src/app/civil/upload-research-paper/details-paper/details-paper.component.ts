import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../../../app.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


@Component({
    selector: 'app-details-paper',
    templateUrl: './details-paper.component.html',
    styleUrls: ['./details-paper.component.css']
})
export class DetailsPaperComponent implements OnInit {
    paperForm: FormGroup;
    collapsed = false;
    tags: any;
    disciplines: any = [];
    toppings = new FormControl();
    filteredOptions: Observable<string[]>;
    myControl = new FormControl();
    options: string[] = ['One', 'Two', 'Three'];

    constructor(private fb: FormBuilder,
                private router: Router,
                public _appService: AppService,
                private appService: AppService) {


        this.paperForm = fb.group({
            'title': [null, Validators.required],
            'discipline': [null, Validators.required],
            'description': [null, Validators.required],
            'tags': [null, Validators.required],
            'lang': [null, Validators.required],

        });
    }

    title = new FormControl('', [Validators.required]);
    discipline = new FormControl('', [Validators.required]);
    description = new FormControl('', [Validators.required]);
    tag = new FormControl('', [Validators.required]);
    lang = new FormControl('', [Validators.required]);

    savePaper() {
        this.appService.paper.append('title', this.paperForm.controls.title.value);
        this.appService.paper.append('discipline', this.paperForm.controls.discipline.value);
        this.appService.paper.append('description', this.paperForm.controls.description.value);
        this.appService.paper.append('lang', this.paperForm.controls.lang.value);
        this.appService.paper.append('tags[]', this.paperForm.controls.tags.value);
        console.log(this.paperForm.controls.tags.value);

        this.router.navigate(['/upload-paper/upload-completed']);

    }


    getTags() {
        this._appService.api.getTagsService()
            .subscribe(response => {
                let result;
                result = response;
                if (result.code === 1) {
                    this.tags = result.data;
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


    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        console.log(this.disciplines.filter(option => option.discipline_en.toLowerCase().indexOf(filterValue) === 0));
        return this.disciplines.filter(option => option.discipline_en.toLowerCase().indexOf(filterValue) === 0);
    }

    ngOnInit() {



        // this.filteredOptions = this.discipline.valueChanges.pipe(
        //     startWith(''),
        //     map(value => this._filter(value))
        // );
        this.getDisciplines();
        if (this.appService.fileName == '') {
            this.router.navigate(['/upload-paper']);

        } else {
            this.getTags();
        }

        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );
    }

}
