import { FormControl } from "@angular/forms";

export interface NewUser {
    firstName: FormControl<string>;
    lastName: FormControl<string>;
}