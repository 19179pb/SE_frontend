import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, FormGroup, NonNullableFormBuilder, Validators, FormControl } from '@angular/forms';
import { LoginData, LoginResponse } from '../models/auth.interfaces';
import { MatMenuModule } from '@angular/material/menu';
import { User } from '../models/user';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ MatIconModule, MatButtonModule, MatMenuModule, NgIf, RouterModule ],
  templateUrl: '../templates/login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  user!: User;

  constructor(public dialog: MatDialog, public authService: AuthService)
  {

  }

  login(): void {
    const dialogRef = this.dialog.open(DialogLogin);
    
    dialogRef.afterClosed().subscribe(result => {
      this.authService.login(result as LoginData)
        .subscribe(result => {
          localStorage.setItem("AuthToken", result.jwt)
          this.authService.verifyToken()  
        });
    });
  }
}

@Component({
  selector: 'dialog-login',
  templateUrl: '../templates/dialog-login.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatIconModule ],
})
export class DialogLogin implements OnInit { 
  protected loginForm!: FormGroup;
  hide = true;
  
  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }
  constructor(
    private readonly formBuilder: NonNullableFormBuilder,
  ){}

  get newUserFormControl() {
    return this.loginForm.controls;
  }

  onSubmit() {
    //this.userService.addUser(this.newUserForm.value as User)
    //  .subscribe( user => {
        return this.loginForm.value as LoginData;
    //  })
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z]+')
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    }
    )
  }
 
}