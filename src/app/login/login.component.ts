import { Component, OnInit, effect } from '@angular/core';
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
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ MatIconModule, MatButtonModule, MatMenuModule, NgIf, RouterModule ],
  templateUrl: '../templates/login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  user?: User;
  isAdmin: boolean = false;
  isAnonymous: boolean = true;
  isFullUser: boolean = false;
  isLimitedUser: boolean = false;
  //authService
  constructor(public dialog: MatDialog, public authService: AuthService, private router: Router)
  {
    effect(() => {
      //this.user = this.authService.user();
      this.isAdmin = this.authService.isAdmin();
      this.isAnonymous = this.authService.isAnonymous();
      this.isFullUser = this.authService.isFullUser();
      this.isLimitedUser = this.authService.isLimitedUser();
    })
  }

  login(): void {
    const dialogRef = this.dialog.open(DialogLogin);
    
    dialogRef.afterClosed().subscribe(result => {
      this.authService.login(result as LoginData)
        .subscribe(result => {
          localStorage.setItem("AuthToken", result.jwt)
          this.authService.verifyToken().then(result => {
            console.log(result);
            this.user = result;
            this.router.navigate(["informations"]);
            console.log ("After navigate");
          }
          )
          //this.user = this.authService.user();
        });
    });
  }
  logout(): void {
    this.authService.logout()
      .subscribe(result => {
        localStorage.removeItem("AuthToken");
        this.authService.verifyToken();  
        this.user = undefined;
        this.router.navigate([""]);
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
    console.log("Login");
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