import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule} from '@angular/material/icon';
import { Information } from '../models/information';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, FormGroup, NonNullableFormBuilder, Validators, FormControl } from '@angular/forms';
import { InformationService } from '../services/information.service';

@Component({
  selector: 'app-informations',
  standalone: true,
  imports: [ MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatTooltipModule ],
  templateUrl: '../templates/informations.component.html',
  styleUrl: './informations.component.scss'
})
export class InformationsComponent {
  informations: Information[] = [];
  
  @ViewChild(MatTable)
  table!: MatTable<Information>;

  columnsToDisplay = ['title', 'link', 'add_date', 'remind_date', 'tools' ];

  constructor(private informationService: InformationService, public dialog: MatDialog)
  {}

  ngOnInit(): void {
    this.getInformations();
    //console.log(this.informations);
  }

  getInformations(): void {
    this.informationService.getInformations()
      .subscribe(informations => this.informations = informations)
  }

  deleteInformation(information: Information): void {
    this.informations = this.informations.filter(i => i !== information);
    this.informationService.deleteInformation(information.id)
    .subscribe();
  }

  addInformation(): void {
    const dialogRef = this.dialog.open(DialogAddInformation);
    dialogRef.afterClosed().subscribe(result => {
      this.informations.push(result);
      this.table.renderRows();
    });
  }
}

@Component({
  selector: 'dialog-add-information',
  templateUrl: '../templates/dialog-add-information.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule , MatSelectModule, FormsModule, ReactiveFormsModule ],
})
export class DialogAddInformation implements OnInit { 
  protected newInformationForm!: FormGroup;
  
  constructor(
    private readonly formBuilder: NonNullableFormBuilder,
  ){}

  get newUserFormControl() {
    return this.newInformationForm.controls;
  }

  onSubmit() {
    //this.userService.addUser(this.newUserForm.value as User)
    //  .subscribe( user => {
        return this.newInformationForm.value as Information;
    //  })
  }

  ngOnInit(): void {
    this.newInformationForm = this.formBuilder.group({
      title: new FormControl('', [
        Validators.required,
      ]),
      content: new FormControl('', [
        Validators.required,
      ]),
      link: new FormControl('', [
        Validators.pattern('[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)')
      ]),
      remindDate: new FormControl('', [
      ]),
      category: new FormControl('', [
        Validators.required
      ]),
        }
    )
  }
}