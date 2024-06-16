import { Component } from '@angular/core';
import { Information } from '../models/information';
import { InformationService } from '../services/information.service';
import { AuthService } from '../services/auth.service';
import { Route, ActivatedRoute, ParamMap } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';

//import { CategoryService } from '../services/category.service';
@Component({
  selector: 'app-information-details',
  standalone: true,
  imports: [ MatCardModule, DatePipe ],
  templateUrl: './information-details.component.html',
  styleUrl: './information-details.component.scss'
})
export class InformationDetailsComponent {
private id?: number;
private isAnonymous : boolean = true;
protected information?: Information;

  constructor(private informationService: InformationService, private route: ActivatedRoute, private authService:AuthService)
    {}

    ngOnInit(){
      this.isAnonymous = this.authService.isAnonymous();
      const informationId = + this.route.paramMap.subscribe(
        (params: ParamMap) => {
          this.id = +params.get('id')!;
          if (this.isAnonymous) {
            //console.log ("Anon")
            this.informationService.getPublicInformation(this.id).subscribe(
              result => {
                this.information = result
                //console.log(this.information);
  
              },
            (err: Error) => {
              this.information = undefined;
            })
  
          } else {
            console.log("non anon")
            this.informationService.getInformation(this.id).subscribe(
              result => {
                this.information = result
                console.log(this.information);
  
              },
            (err: Error) => {
              this.information = undefined;
            })  
          }
        }
      );
    }

}
