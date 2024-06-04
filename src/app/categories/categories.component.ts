import { Component, ViewChild, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { FormsModule, ReactiveFormsModule, FormGroup, NonNullableFormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
  templateUrl: '../templates/categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  categories: Category[] = [];
  newCategory?: Category;
  columnsToDisplay = ['name'];

  @ViewChild(MatTable)
  table!: MatTable<Category>;

  constructor(private categoryService: CategoryService, public dialog: MatDialog)
  {}

  ngOnInit(): void {
    this.getCategories();
    console.log(this.categories);
  }

  getCategories(): void {
    this.categoryService.getCategories()
      .subscribe(categories => this.categories = categories)
  }

  deleteCategory(category: Category): void {
    this.categories = this.categories.filter(c => c !== category);
    this.categoryService.deleteCategory(category.id)
    .subscribe();
  }

  addCategory(): void {
    const dialogRef = this.dialog.open(DialogAddCategory);
    dialogRef.afterClosed().subscribe(result => {
      //this.newUser = result as User
      console.log('dialog Closed')
      console.log(result as Category); 
      this.categories.push(result);
      this.table.renderRows();
    });
  }
}


@Component({
  selector: 'dialog-add-category',
  templateUrl: '../templates/dialog-add-category.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule , FormsModule, ReactiveFormsModule ],
})
export class DialogAddCategory implements OnInit { 
  protected newInformationForm!: FormGroup;
  
  constructor(
    private readonly formBuilder: NonNullableFormBuilder,
  ){}

  get newUserFormControl() {
    return this.newInformationForm.controls;
  }

  onSubmit() {
    //this.userService.addUser(this.newUserForm.value as User)
    //  .subscribe( user => {
        return this.newInformationForm.value as Category;
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
      remindDate: new FormControl('', [
      ]),
      category: new FormControl('', [
        Validators.required
      ]),
        }
    )
  }
}
