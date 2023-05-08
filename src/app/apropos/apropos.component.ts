import { Component, OnInit } from '@angular/core';
import {ShareServiceService} from "../Services/share-service.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {OpinionResult} from "../Models/opinionResult";

@Component({
  selector: 'app-apropos',
  templateUrl: './apropos.component.html',
  styleUrls: ['./apropos.component.scss'],
  animations: [
    trigger('countAnimation', [
      transition(':increment', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]

})
export class AproposComponent implements OnInit {

  doctorCount!: number;
  patientCount!:number;
  countTo!: number ;
  count: number = 0;
  chirurgieCount!:number;
  opinion : OpinionResult[] = [];


  constructor(private userService: ShareServiceService,private share: ShareServiceService) { }

  ngOnInit() {
  this.getDoctorCount();
  this.getPatientCount();
   this.getChirurgieCount();
   this.getEnableOpinion();
  }

  getDoctorCount(){
    this.userService.getDoctorCount().subscribe(count => {
      this.doctorCount = count;
    });
  }

  getPatientCount(){
    this.userService.getPatientCount().subscribe(count => {
      this.patientCount = count;
      this.countTo=this.patientCount;
    });
  }

  getChirurgieCount(){
    this.userService.getChirurgieCount().subscribe(count => {
      this.chirurgieCount = count;
    });
  }

  getRange(countTo: number): number[] {
    return Array(countTo).fill(0).map((_, i) => i + 1);
  }


  getEnableOpinion(){
    this.share.getAllEnableOpinion().subscribe((data)=>{
      this.opinion=data;

      console.log("opinion",this.opinion)
    })

  }
}
