import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { FormsModule, ReactiveFormsModule, FormGroup, NonNullableFormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule ],
  templateUrl: '../templates/categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  categories: Category[] = [];
  newCategory?: Category;
  columnsToDisplay = ['name', 'tools'];

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
      .subscribe(categories => {
        this.categories = categories
        console.log(categories);
      })
  }

  deleteCategory(category: Category): void {
    this.categories = this.categories.filter(c => c !== category);
    this.categoryService.deleteCategory(category.id)
    .subscribe();
  }

  addCategory(): void {
    const dialogRef = this.dialog.open(DialogAddCategory, {data: {undefined, action: 'add'}});
    dialogRef.afterClosed().subscribe(result => {
      this.categoryService.addCategory(result as Category)
        .subscribe( result =>{
          if (result) {
            console.log(result);
            this.categories.push(result as Category);
            this.table.renderRows();      
          }
        }
        )
    });
  }

  editCategory(category: Category): void {
    console.log(category);
    const dialogRef = this.dialog.open(DialogAddCategory, {data: {category, action: 'edit'}});
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {

      } else {
        this.categoryService.editCategory(result as Category)
        .subscribe( result =>{
          const index = this.categories.findIndex((el) => el.id == result.id)
          this.categories[index] = result;
          this.table.renderRows();    
        })
      }
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
  protected newCategoryForm!: FormGroup;
  
  constructor(
    private readonly formBuilder: NonNullableFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {category:Category, action: string},
  ){}

  get newUserFormControl() {
    return this.newCategoryForm.controls;
  }

  onSubmit() {
    //this.userService.addUser(this.newUserForm.value as User)
    //  .subscribe( user => {
        return this.newCategoryForm.value as Category;
    //  })
  }

  ngOnInit(): void {
    this.newCategoryForm = this.formBuilder.group({
      id: new FormControl('', [
        //Validators.required,
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/([a-z])+/g),
      ]),
        }
    )
    if (this.data.category != undefined) {
      this.newCategoryForm.controls['id'].setValue(this.data.category.id);
      this.newCategoryForm.controls['name'].setValue(this.data.category.name);
    }
  }
}
