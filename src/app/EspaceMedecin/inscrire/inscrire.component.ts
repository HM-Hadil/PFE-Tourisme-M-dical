import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder,FormControl,FormGroup, Validators,} from '@angular/forms';
import { Router } from '@angular/router';
import { MedecinModel } from 'src/app/Models/MedecinModel';
import * as alertify from "alertifyjs";

import { ShareServiceService } from 'src/app/Services/share-service.service';
import {TypeChirurgie} from "../../Models/typeChirurgie/type-chirurgie";

@Component({
  selector: 'app-inscrire',
  templateUrl: './inscrire.component.html',
  styleUrls: ['./inscrire.component.scss']
})
export class InscrireComponent implements OnInit {
  MedecinForm!:FormGroup;
  userFile: any;
  public imagePath: any;
  imgURL: any = '';
  emailExists = false;
  chirurgieList: TypeChirurgie[]= [];


  constructor(private share: ShareServiceService,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder) {

      this.MedecinForm = this.fb.group({

        adresse: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        firstname: ['', Validators.required],
        gender: ['', Validators.required],
        image: ['', Validators.required],
        lastname: ['', Validators.required],

        experience: this.fb.array([]),

        parcours: this.fb.array([]),
        password: ['', Validators.required],
        specialite:  [''],
        surgeries: this.fb.array([]),
        telephone: ['', Validators.required],
        ville: ['', Validators.required]
      });


      }



  ngOnInit(){
    this.getListChirurgie()
  }


  changeEventSpecialite(event: any) {
    const selectedSurgeries = this.MedecinForm.controls['surgeries'] as FormArray;
    const surgery = event.target.value;
      selectedSurgeries.push(new FormControl(surgery));


  }
  get parcours() {
    return  this.MedecinForm.controls["parcours"] as FormArray;

  }

  get experience() {
    return this.MedecinForm.controls["experience"] as FormArray;
  }

  addNewParcours(){
    const parcoursFormGroup =this.fb.group({
      diploma: ['', Validators.required],
      establishment: ['', Validators.required],
      field: ['', Validators.required],
    });
    this.parcours.push(parcoursFormGroup);

  }

  addNewExperience(){
    const experienceFormGroup = this.fb.group({
      establishment: ['', Validators.required],
      specialty: ['', Validators.required],
    });

    this.experience.push(experienceFormGroup);

  }


  remove(Index: number) {
    this.parcours.removeAt(Index);
  }

  removeEx(Index: number) {
    this.experience.removeAt(Index);
  }

  //get All Chirurgie
  getListChirurgie() {
    this.share.getAllChirurgie().subscribe(
      (response) => {
        this.chirurgieList = response;
        console.log('reload data ==>>', this.chirurgieList);
      },

      (err) => {
        console.error('Error ', err);
      }
    );
  }

  signUpMedecin(){

    let data = this.MedecinForm.value;
    console.log("data from form-->",data);

   let medecins = new MedecinModel(
      data.id,
      data.firstname,
      data.lastname,
      data.email,
      data.password,
      data.ville,
      data.adresse,
      data.specialite,
      data.gender,
      this.imgURL,
      data.telephone,
      data.experience,
      data.parcours,
      data.surgeries


    );

    this.share.checkEmailExists(medecins.email).subscribe();
   console.log("medecinModel-->", medecins);
    this.share.signUpMedecin(medecins).subscribe();
    console.log('>>>> Add medecins to backend', medecins);
      alertify.success("votre inscription a réussi  ")
    alert("vos données ont été envoyées au admin " +
      "Attendez, votre compte sera activé aprés la vérification ! ")

   }
  //upload Image
  onSelectFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userFile = file;

      var reader = new FileReader();

      this.imagePath = file;
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      };
    }

  }





}
