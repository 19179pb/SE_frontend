import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [ MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, FormsModule ],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.scss'
})
export class RegisterUserComponent {
  @Input() user?: User;

  constructor(private userService: UserService) {}

  registerUser(){
    this.userService.registerUser(this.user as User)
      .subscribe(user=> {
        
      })
  }
}
