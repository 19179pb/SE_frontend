import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgIf, JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { User, createUser } from '../models/user';
import { UserService } from '../services/user.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, FormControl, Validators, ReactiveFormsModule, FormGroup, FormBuilder, NonNullableFormBuilder } from '@angular/forms';
import { NewUser } from '../models/newUser';
import { Dialog } from '@angular/cdk/dialog';
import { empty } from 'rxjs';

export interface DialogData {
  user: User;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule ],
  templateUrl: '../templates/users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  users: User[] = [];
  newUser?: User;
  columnsToDisplay = ['firstName', 'lastName', 'age', 'login', 'tools' ];

  @ViewChild(MatTable)
  table!: MatTable<User>;

  constructor(private userService: UserService, public dialog: MatDialog)
  {}

  ngOnInit(): void {
    this.getUsers();
    console.log(this.users);
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users
        console.log(users);
      })
  }

  deleteUser(user: User): void {
    this.users = this.users.filter(u => u !== user);
    this.userService.deleteUser(user.id)
    .subscribe();
  }

  addUser(): void {
    let user = createUser({});
    const dialogRef = this.dialog.open(DialogAddUser, {data: {user, action: 'add'}});
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {

      } else {
        this.userService.addUser(result as User).subscribe(result => {
          this.users.push(result);
          this.table.renderRows();  
        })  
      }
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(DialogAddUser, {data: {user, action: 'edit'}});
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {

      } else {
        console.log(result);
        this.userService.editUser(result as User).subscribe(result => {
          const index = this.users.findIndex((el) => el.id == result.id)
          this.users[index] = result;
          this.table.renderRows();  
        })  
      }
    });
  }
}

@Component({
  selector: 'dialog-add-user',
  templateUrl: '../templates/dialog-add-user.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule , MatSelectModule, FormsModule, ReactiveFormsModule ],
})
export class DialogAddUser implements OnInit { 
  protected newUserForm!: FormGroup;

  constructor(
    private readonly formBuilder: NonNullableFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {user:User, action: string},
  
  ){}



  get newUserFormControl() {
    return this.newUserForm.controls;
  }

  onSubmit() {
    //this.userService.addUser(this.newUserForm.value as User)
    //  .subscribe( user => {
        return this.newUserForm.value as User;
    //  })
  }

  ngOnInit(): void {
    this.newUserForm = this.formBuilder.group({
      id: new FormControl('', [
        Validators.required,
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Z][a-zA-Z]+')
      ]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[A-Z][a-zA-Z]+')
      ]),
      age: new FormControl('', [
        Validators.required,
        Validators.min(18)
      ]),
      login: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z]+')
      ]),
      password: new FormControl('', [
        Validators.required
      ]),
      role: new FormControl('', [
        Validators.required
      ])
    }
    )
    this.newUserForm.controls['id'].setValue(this.data.user.id);
    this.newUserForm.controls['lastName'].setValue(this.data.user.lastName);
    this.newUserForm.controls['firstName'].setValue(this.data.user.firstName);
    this.newUserForm.controls['age'].setValue(this.data.user.age);
    this.newUserForm.controls['login'].setValue(this.data.user.login);
    this.newUserForm.controls['password'].setValue(this.data.user.password);
    this.newUserForm.controls['role'].setValue(this.data.user.role);

  }
 
}