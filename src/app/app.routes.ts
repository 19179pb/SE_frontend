import { Routes } from '@angular/router';
import { RegisterUserComponent } from './register-user/register-user.component';
import { UsersComponent } from './users/users.component';
import { InformationsComponent } from './informations/informations.component';
import { CategoriesComponent } from './categories/categories.component';


export const routes: Routes = [
    { path: 'register-user', component: RegisterUserComponent },
    { path: 'users', component: UsersComponent },
    { path: 'informations', component: InformationsComponent },
    { path: 'categories', component: CategoriesComponent }
];
