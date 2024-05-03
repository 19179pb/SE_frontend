import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { Information } from '../information';
import { InformationService } from '../information.service';

@Component({
  selector: 'app-informations',
  standalone: true,
  imports: [ MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatTooltipModule ],
  templateUrl: './informations.component.html',
  styleUrl: './informations.component.scss'
})
export class InformationsComponent {
  informations: Information[] = [];

  columnsToDisplay = ['title', 'link', 'add_date', 'remind_date', 'tools' ];

  constructor(private informationService: InformationService)
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

}
