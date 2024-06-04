import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
//import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ RouterModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  login(): void {
    
  }
}
