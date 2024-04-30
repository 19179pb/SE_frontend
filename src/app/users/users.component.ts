import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})

export class UsersComponent {
  users: User[] = [];
  columnsToDisplay = ['firstName', 'lastName', 'age', 'login', 'tools' ];

  constructor(private userService: UserService)
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

}
