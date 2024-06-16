import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [ MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.scss'
})
export class RegisterUserComponent {
  //@Input() user?: User;
  user: Partial<User> = {
    firstName:'',
    lastName:'',
    login:'',
    password:'',
    age: 0
  };
  userForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    age: new FormControl(''),
    login: new FormControl(''),
    password: new FormControl('')

  });

  constructor(private authService: AuthService) {}

  registerUser(){
    console.log(this.userForm.value);
    //this.user = 
    this.user.firstName = this.userForm.value.firstName?.toString();
    this.user.lastName = this.userForm.value.lastName?.toString();
    if (this.userForm.value.age) this.user.age = +this.userForm.value.age;
    this.user.login = this.userForm.value.login?.toString();
    this.user.password = this.userForm.value.password?.toString();
    console.log(this.user);
    this.authService.registerUser(this.user)
      .subscribe(user=> {
        
      })
  }
}
