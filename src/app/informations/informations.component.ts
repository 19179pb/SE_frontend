import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule} from '@angular/material/icon';
import { Information, createInformation } from '../models/information';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, FormGroup, NonNullableFormBuilder, Validators, FormControl } from '@angular/forms';
import { InformationService } from '../services/information.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-informations',
  standalone: true,
  imports: [ MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatTooltipModule, DatePipe ],
  templateUrl: '../templates/informations.component.html',
  styleUrl: './informations.component.scss'
})
export class InformationsComponent {
  informations: Information[] = [];
  categories: Category[] = [];
  
  @ViewChild(MatTable)
  table!: MatTable<Information>;

  columnsToDisplay = ['title', 'addDate', 'category', 'tools' ];

  constructor(private informationService: InformationService, private categoryService: CategoryService, public dialog: MatDialog)
  {}

  ngOnInit(): void {
    this.getInformations();
    //console.log(this.informations);
  }

  getInformations(): void {
    this.informationService.getInformations()
      .subscribe(informations => this.informations = informations)
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
    const dialogRef = this.dialog.open(DialogAddInformation, {data: {information, action: 'details'}});
    dialogRef.afterClosed().subscribe(result => {

    })
  }
}

@Component({
  selector: 'dialog-add-information',
  templateUrl: '../templates/dialog-add-information.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule , MatSelectModule, FormsModule, ReactiveFormsModule ],
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
      title: new FormControl('', [
        Validators.required,
      ]),
      content: new FormControl('', [
        Validators.required,
      ]),
      link: new FormControl('', [
        Validators.pattern('[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)')
      ]),
      remainder: new FormControl('', [
      ]),
      category: new FormControl('', [
        Validators.required
      ]),
      isPublic: new FormControl('', [
        Validators.required,
      ])
        }
    )
    this.newInformationForm.controls['title'].setValue(this.data.information.title);
    this.newInformationForm.controls['content'].setValue(this.data.information.content);
    this.newInformationForm.controls['isPublic'].setValue(this.data.information.isPublic);
    this.newInformationForm.controls['link'].setValue(this.data.information.link);
    this.newInformationForm.controls['remainder'].setValue(this.data.information.remainder);
    if (this.data.action=='details') {
      console.log('Details disable');
      this.newInformationForm.controls['title'].disable();
      this.newInformationForm.controls['content'].disable();
      this.newInformationForm.controls['isPublic'].disable();
      this.newInformationForm.controls['link'].disable();
      this.newInformationForm.controls['remainder'].disable();
    }
  }
}