import { Component, OnInit } from '@angular/core';
import {PatientModel} from "../../../Models/PatientModel";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserAuthService} from "../../../Services/interceptor/user-auth.service";
import {ShareServiceService} from "../../../Services/share-service.service";
import {AppointmentRequest} from "../../../Models/AppointmentRequest";
import alertify from "alertifyjs";
import {MedecinModel} from "../../../Models/MedecinModel";

@Component({
  selector: 'app-rdv-avec-med',
  templateUrl: './rdv-avec-med.component.html',
  styleUrls: ['./rdv-avec-med.component.scss']
})
export class RdvAvecMedComponent implements OnInit {



  idChirurgie!:any;
  idDoctor!:any;
  name!:any;
  nomMed!:any;
  prenomMed!:any;
  idP!:number;
  medecin!:MedecinModel;
  patient! : PatientModel;
  appointmentForm!: FormGroup;
  userFile: any;
  imagePath: any ='';
  imgURL: any = '';
  showDiabete = false;
  showTension = false;
  showAutreMaladie=false;
  showAncienOp=false
  ImageDiabeteAnalyse: any ='';
  ImageAnalyseancienOp: any ='';
  ImageautreAnalyse: any ='';
  ImageAnalyseAutreMaladie: any ='';

  constructor(private route:ActivatedRoute,
              private router: Router,
              private userAuth : UserAuthService,
              private  share: ShareServiceService ,private fb: FormBuilder) {

    this.appointmentForm = this.fb.group({
      age: ['',[Validators.required, Validators['min'](1), Validators['max'](100)]],
      dateRDV: ['', Validators.required],
      doctorId: [''],
      patientId: [, Validators.required],
      image: ['', Validators.required],
      note: ['', Validators.required],
      phone: ['', Validators.required],
      // surgeryId: [this.idCh, Validators.required],
      typeSang: ['', Validators.required],
      ville: ['', Validators.required],
      weight: ['',[Validators.required, Validators['min'](1), Validators['max'](300)]],
      surgeries: [, Validators.required],
      alcoolique: ['', Validators.required],
      tension: ['', Validators.required],
      diabete: ['', Validators.required],
      fumee: ['', Validators.required],
      mesureTension: [''],
      mesureDiabete: [''],
      analyseDiabete: [''],
      autreMaladie: [''],
      desAutreMaladie: ['', Validators.required],
      analyseAutreMaladie: [''],
      ancienOperation: ['', Validators.required],
      nomAncienOperation: [''],
      analyseAncienOperation: [''],
      autreAnalyse: [''],
    });
  }

  ngOnInit(): void {
    this.getChirurgieById();
    this.getPatientInfo();
    this.getDoctorById()
    this.appointmentForm.patchValue({patientId:this.idP,
      surgeries:this.idChirurgie.replace(/"/g, ''),
      doctorId:this.idDoctor.replace(/"/g, '')
    });
  }


  showDiabeteFields(event: Event) {
    if ((event.target as HTMLInputElement).value === 'oui') {
      this.showDiabete = true;
    }
  }

  showAutreMaladieFields(event: Event) {
    if ((event.target as HTMLInputElement).value === 'oui') {
      this.showAutreMaladie = true;
    }

  }
  showTensionFields(event: Event) {
    if ((event.target as HTMLInputElement).value === 'oui') {
      this.showTension = true;
    }

  }
  showAncienOpFields(event: Event) {
    if ((event.target as HTMLInputElement).value === 'oui') {
      this.showAncienOp = true;
    }
  }

  hideDiabeteFields() {
    this.showDiabete = false;
  }
  hideTensionFields() {
    this.showTension = false;
  }
  hideAncienOpFields() {
  this.showAncienOp=false
  }

  hideAutreMaladieFields() {
    this.showAutreMaladie=false;
  }
  changeEventChirurgie(event: any) {
    const selectedSurgeries = this.appointmentForm.controls['surgeries'] as FormArray;
    const surgery = event.target.value;
    selectedSurgeries.push(new FormControl(surgery));
  }


  getChirurgieById(){

    this.idChirurgie = this.share.getIdChirurgie()
    console.log("id chirurgie", this.idChirurgie)

    this.share.getChirurgirById(this.idChirurgie.replace(/"/g, '')).subscribe(res=>{
      this.name=res.name;
      console.log("name",this.name);
    })
  }

  getDoctorById(){
    this.idDoctor = this.share.getIdDoctor()
    console.log("id doctor", this.idDoctor)

    this.share.getActivateDoctor(this.idDoctor.replace(/"/g, '')).subscribe(res=>{
       this.nomMed=res.firstname;
       this.prenomMed=res.lastname;
       console.log("nom et prenom med",this.nomMed,this.prenomMed);
     })
  }

  onSubmit() {

      let data=this.appointmentForm.value;
      console.log("data form:", data);
      const appointmentRequest = new AppointmentRequest(
        data.id,
        data.note,
        this.imagePath,
        data.age,
        this.idP,
        data.ville,
        data.weight,
        data.dateRDV,
        data.typeSang,
        data.phone,
        this.idChirurgie.replace(/"/g, ''),
        data.doctorId.replace(/"/g, ''),
        data.alcoolique,
        data.tension,
        data.diabete,
        data.fumee,
        data.mesureTension,
        data.mesureDiabete,
        this.ImageDiabeteAnalyse,
        data.autreMaladie,
        data.desAutreMaladie,
        this.ImageAnalyseAutreMaladie,
        data.ancienOperation,
        data.nomAncienOperation,
        this.ImageAnalyseancienOp,
        this.ImageautreAnalyse,

      );
      console.log(appointmentRequest);

      this.share.createAppointment(appointmentRequest).subscribe(resultRDV=>{
        console.log(resultRDV);

      })
      alertify.success("Rendez-vous ajoutée ")
      this.router.navigate(['listRdv'])
    }


  getPatientInfo():any {
    const token = this.getToken();
    console.log("token:", token);
    if (token) {
      //Decode the token to get the payload (which contains user information
      const payload =JSON.parse(window.atob(token.split('.')[1]));
      const id = payload.sub;
      this.idP=payload.sub;
      console.log("idP", this.idP)
      console.log("decoded payload:", payload);
      this.share.getActivatePatient(id).subscribe((data)=>{
        this.patient = data;

        console.log("info users by id :",this.patient)
      });

      return payload;


    } else {
      return null;
    }
  }


  getToken() {
    return localStorage.getItem("token") ;
  }

  //upload Image
  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
      };
    }
  }


  onSelectFileDiabeteAnalyse(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.ImageDiabeteAnalyse = e.target.result;
      };
    }
  }



  onSelectFileAnalyseancienOp(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.ImageAnalyseancienOp = e.target.result;
      };
    }
  }


  onSelectFileautreAnalyse(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.ImageautreAnalyse = e.target.result;
      };
    }
  }

  onSelectFileAnalyseAutreMaladie(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.ImageAnalyseAutreMaladie = e.target.result;
      };
    }
  }

}
