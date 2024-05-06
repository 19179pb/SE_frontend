import { Component, OnInit } from '@angular/core';
import { NgIf, JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../user';
import { UserService } from '../user.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, FormControl, Validators, ReactiveFormsModule, FormGroup, FormBuilder, NonNullableFormBuilder } from '@angular/forms';
import { NewUser } from '../newUser';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})

export class UsersComponent {
  users: User[] = [];
  newUser?: User;
  columnsToDisplay = ['firstName', 'lastName', 'age', 'login', 'tools' ];

  constructor(private userService: UserService, public dialog: MatDialog)
  {}

  ngOnInit(): void {
    this.getUsers();
    console.log(this.users);
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => this.users = users)
  }

  deleteUser(user: User): void {
    this.users = this.users.filter(u => u !== user);
    this.userService.deleteUser(user.id)
    .subscribe();
  }

  addUser(): void {
    const dialogRef = this.dialog.open(DialogAddUser);
    dialogRef.afterClosed().subscribe(result => {
      //this.newUser = result as User
      this.users.push(result as User);
    });
    //console.log(this.newUser);
/*
      this.userService.addUser(result as User)
      .subscribe( user => {
        console.log(this.users);
        this.users.push(user);
        console.log (this.users);
  
      })      

    })
*/
  }

}

@Component({
  selector: 'dialog-add-user',
  templateUrl: './dialog-add-user.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule , MatSelectModule, FormsModule, ReactiveFormsModule ],
})
export class DialogAddUser implements OnInit { 
  protected newUserForm!: FormGroup;
  
  constructor(
    private readonly formBuilder: NonNullableFormBuilder,
  ){}

  get newUserFormControl() {
    return this.newUserForm.controls;
  }
/*
  onSubmit() {
    this.userService.addUser(this.newUserForm.value as User)
      .subscribe( user => {
        return user;
      })
  }
*/
  ngOnInit(): void {
    this.newUserForm = this.formBuilder.group({
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
  }
 
}