import { FormControl } from "@angular/forms";

export interface NewUser {
    title: FormControl<string>;
    content: FormControl<string>;
    link: FormControl<string>;
}