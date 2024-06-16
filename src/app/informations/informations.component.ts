import { Component, OnInit, Inject, ViewChild, effect } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule} from '@angular/material/icon';
import { Content, Information, createInformation } from '../models/information';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule, FormGroup, NonNullableFormBuilder, Validators, FormControl } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { InformationService } from '../services/information.service';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute, ParamMap } from '@angular/router';
//import { PagedRequest } from '../models/information';
import {Sort, MatSortModule} from '@angular/material/sort';

@Component({
  selector: 'app-informations',
  standalone: true,
  imports: [ MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatTooltipModule, DatePipe, RouterLink, MatPaginatorModule, MatSortModule ],
  templateUrl: '../templates/informations.component.html',
  styleUrl: './informations.component.scss'
})
export class InformationsComponent {
  informations: Information[] = [];
  content?: Content;
  categories: Category[] = [];
  isLimitedUser: boolean = true;
  pageEvent?: PageEvent;

  length = 0;
  pageSize = 10;
  pageIndex = 0;
  sortRow = "title";
  sortDir = "asc";

  @ViewChild(MatTable)
  table!: MatTable<Information>;

  columnsToDisplay = ['title', 'addDate', 'category', 'tools' ];

  constructor(private informationService: InformationService, private categoryService: CategoryService, public dialog: MatDialog, private authService: AuthService)
  {
    effect(()=> {
      this.isLimitedUser = this.authService.isLimitedUser();
      //this.getInformations();
    }

    )
  }

  ngOnInit(): void {
    
    this.getPagedInformations();
    //console.log(this.informations);
  }


  getPagedInformations(): void {
    this.informationService.getPagedInformations({page: this.pageIndex, size: this.pageSize, sortRow: this.sortRow, sortDir: this.sortDir})
      .subscribe(informations => {
        if (informations != undefined) {
          this.content = informations;
          this.length = informations.totalElements;
          this.pageSize = informations.size;
          this.pageIndex = informations.number;
          if (this.content.totalElements == undefined)
            this.content.totalElements = 0;
          this.informations = this.content.content;
          console.log(informations);
  
        }
      })
  }


  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getPagedInformations();
  }

  sortData(sort: Sort){
    this.sortDir = sort.direction;
    this.sortRow = sort.active;
    this.getPagedInformations();
    console.log(sort);
  }

  getInformations(): void {
    this.isLimitedUser = this.authService.isLimitedUser();
    console.log(this.authService.user());
    if (this.isLimitedUser === true) {
      console.log("limited");
      this.informationService.getPublicInformations()
      .subscribe(informations => {
        this.informations = informations
        console.log(informations);
      })

    } else {
      //console.log("full");
      this.informationService.getInformations()
      .subscribe(informations => {
        this.informations = informations
        console.log(informations);
      })

    }
  }

  deleteInformation(information: Information): void {
    this.informations = this.informations.filter(i => i !== information);
    this.informationService.deleteInformation(information.id!)
    .subscribe();
  }

  addInformation(): void {
    this.categoryService.getCategories()
      .subscribe(categories => 
        {
          const information = createInformation({});
          const dialogRef = this.dialog.open(DialogAddInformation, {data: {information, action: 'add', categories}} );
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              const category = categories.find((el)=> el.id ==result.category)
              result.categoryName = category?.name;
              this.informationService.addInformation(result as Information)
                .subscribe(result => {
                  result.addDate = new Date();
                  this.informations.push(result);
                  this.table.renderRows();      
                })
            }
        });
    });
  }
  showDetails(information: Information): void {
    this.categoryService.getCategories()
      .subscribe(categories => {
        const dialogRef = this.dialog.open(DialogAddInformation, {data: {information, action: 'details', categories}});
        //dialogRef.afterClosed().subscribe(result => {    
        //})
        
      })
  }
  editInformation(information: Information): void {
    this.categoryService.getCategories()
      .subscribe(categories => 
        {
          const dialogRef = this.dialog.open(DialogAddInformation, {data: {information, action: 'edit', categories}} );
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              const category = categories.find((el)=> el.id ==result.category)
              result.categoryName = category?.name;
              this.informationService.updateInformation(result as Information)
                .subscribe(result => {
                  //result.addDate = new Date();
                  const idx = this.informations.findIndex((el) => el.id == result.id)
                  this.informations[idx] = result;
                  //this.informations.push(result);
                  this.table.renderRows();      
                })
            }
        });
    });
  }


}

@Component({
  selector: 'dialog-add-information',
  templateUrl: '../templates/dialog-add-information.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule , MatSelectModule, FormsModule, ReactiveFormsModule, MatSlideToggleModule ],
})
export class DialogAddInformation implements OnInit { 
  protected newInformationForm!: FormGroup;
  
  constructor(
    private readonly formBuilder: NonNullableFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {information: Information, action: string, categories: Category[]},
  ){}

  get newInformationFormControl() {
    return this.newInformationForm.controls;
  }

  onSubmit() {
    //this.userService.addUser(this.newUserForm.value as User)
    //  .subscribe( user => {
        return this.newInformationForm.value as Information;
    //  })
  }

  ngOnInit(): void {
    this.newInformationForm = this.formBuilder.group({
      id: new FormControl('', [
      ]),
      title: new FormControl('', [
        Validators.required,
      ]),
      content: new FormControl('', [
        Validators.required,
      ]),
      addDate: new FormControl('',[]),
      categoryName: new FormControl('', []),
      link: new FormControl('', [
        Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
      ]),
      remainder: new FormControl('', [
      ]),
      category: new FormControl('', [
        Validators.required
      ]),
      isPublic: new FormControl('', [
      ])
        }
    )
    let category = this.data.categories.find((el) => el.name == this.data.information.categoryName)?.id;
    this.newInformationForm.controls['id'].setValue(this.data.information.id);
    this.newInformationForm.controls['title'].setValue(this.data.information.title);
    this.newInformationForm.controls['content'].setValue(this.data.information.content);
    this.newInformationForm.controls['isPublic'].setValue(this.data.information.isPublic);
    this.newInformationForm.controls['link'].setValue(this.data.information.link);
    this.newInformationForm.controls['remainder'].setValue(this.data.information.remainder);
    this.newInformationForm.controls['addDate'].setValue(this.data.information.addDate);
    this.newInformationForm.controls['category'].setValue(category);
    this.newInformationForm.controls['categoryName'].setValue(this.data.information.categoryName);
    this.newInformationForm.controls['isPublic'].setValue(this.data.information.isPublic);
    if (this.data.action=='details') {
      //console.log('Details disable');
      this.newInformationForm.controls['title'].disable();
      this.newInformationForm.controls['content'].disable();
      this.newInformationForm.controls['isPublic'].disable();
      this.newInformationForm.controls['link'].disable();
      this.newInformationForm.controls['remainder'].disable();
      this.newInformationForm.controls['addDate'].disable();
      this.newInformationForm.controls['categoryName'].disable();
      this.newInformationForm.controls['isPublic'].disable();
    }
  }
}