import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {map, Observable, of, Subject, tap} from "rxjs";
import {TypeChirurgie} from "../Models/typeChirurgie/type-chirurgie";
import {environment} from "../../environments/environment";
import { PatientModel } from '../Models/PatientModel';
import { MedecinModel } from '../Models/MedecinModel';
import { AdminModel } from '../Models/AdminModel';
import { Authentication } from '../Models/Authentication';
import {UserAuthService} from "./interceptor/user-auth.service";
import {catchError} from "rxjs/operators";
import {AppointmentRequest} from "../Models/AppointmentRequest";
import {AppointementResult} from "../Models/AppointementResult";
import {UpdateAppointmentRequest} from "../Models/UpdateAppointmentRequest";
import { AppointmentStatsResult } from '../Models/appointmentStatsResult';

@Injectable({
  providedIn: 'root'
})
export class ShareServiceService {
  Url = 'http://localhost:8800/chirurgies/GetChirurgieById';
 urlPut='http://localhost:8800/chirurgies/UpdateChirurgie';
 UrlDr = "http://localhost:8800/accounts/doctor";
  UrlDelete = "http://localhost:8800/accounts/deleteAccount"
  UrlActivate = "http://localhost:8800/accounts/activateAccount"
  UrlgetActiveD = "http://localhost:8800/accounts/Activedoctor"
  UrlgetActiveP = "http://localhost:8800/accounts/ActivePatient"
  UrlDesactivateD="http://localhost:8800/accounts/desactivateAccount"
  urlApntmntByDoctor="http://localhost:8800/appointments/getAppointmentByDoctor"
  urlApntmntById="http://localhost:8800/appointments/getAppointmentById"
  urlAffecterMedecin="http://localhost:8800/appointments/affecterMedecin"
  urlRdvPatient="http://localhost:8800/appointments/getAppointmentByPatient"

  idChirurgie!:string;

  private user!: MedecinModel;
  private errorMessage!: string;
  //without auth
  requestHeader= new HttpHeaders(
  {"No-Auth" :"true"}
);


  private _refreshrequired = new Subject<void>();
  get RequiredRefresh(){
    return this._refreshrequired;
  }

  constructor(private http: HttpClient, private  userAuthService : UserAuthService) { }

  // Add chirurgie

  AddChirurgie(chirurgie: TypeChirurgie):Observable<any>{
  return this.http.post(environment.api+"chirurgies/addChirurgie",chirurgie).pipe(
    tap(()=>{
      this._refreshrequired.next()
    })
  );
}

  //Get chirurgie By Id

  getChirurgirById(id : string):Observable<TypeChirurgie>{
    return this.http.get<TypeChirurgie>(`${this.Url}/${id}`);
  }

  //Get All chirurgie

  getAllChirurgie():Observable<TypeChirurgie[]>{
    return this.http.get<TypeChirurgie[]>(environment.api+"chirurgies/getAllChirurgie");
  }

  //Update Chirurgie by id

  updateChirurgie(id: string, chirurgie: TypeChirurgie):Observable<Object>{
    return this.http.put(`${this.urlPut}/${id}`,chirurgie, ).pipe(
      tap(()=>{
        this._refreshrequired.next()
      })
    );
  }

  //delete Chirurgie
  deleteChirurgie(id:number):Observable<any>{
    return this.http.delete(environment.api+'chirurgies/DeleteChirurgie/'+id).pipe(
      tap(()=>{
        this._refreshrequired.next()
      })
    );
  }



//add patient
    signUpPatient(usersP : PatientModel):Observable<any>{
      return this.http.post(environment.api+"register/patient",usersP);

    }

    //add medecins
    signUpMedecin(usersM : MedecinModel):Observable<any>{
      return this.http.post(environment.api+"register/doctor",usersM);

    }

      //add admin
      signUpAdmin(usersA : AdminModel):Observable<any>{
        return this.http.post(environment.api+"register/admin",usersA);
      }

  checkEmailExists(email: string) {
    return this.http.get<boolean>(`http://localhost:8800/register/checkEmailExists/${email}`);
  }

      //login
     login(request : Authentication):Observable<any>{


       return this.http.post(environment.api+"authenticate",request,{headers:this.requestHeader});
     }

  public roleMatch(allowedRoles: any): boolean {
    let isMatch =false;
    const userRole: any = this.userAuthService.getRole();
    if (userRole != null && userRole) {
      for (let i = 0; i < userRole.length; i++) {
        if (allowedRoles.includes(userRole[i])) {
          isMatch = true;
          return isMatch;
        }
      }
    }
    return isMatch;
  }


     // get all disabled accounts doctors
     getDisableddoctor():Observable<MedecinModel[]>{
    return  this.http.get<MedecinModel[]>(environment.api+"accounts/disabledDoctor");
     }

  // get all disabled accounts patients
  getDisabledPatient():Observable<PatientModel[]>{
    return  this.http.get<PatientModel[]>(environment.api+"accounts/disabledPatient");
  }
     //get account doctor by id
     getDoctorByIdAndEnabledFalse(id: number):Observable<MedecinModel>{
    return  this.http.get<MedecinModel>(`${this.UrlDr}/${id}`,{headers:this.requestHeader});
  }

  // get all active accounts patients
  getAllActivePatient():Observable<PatientModel[]>{
    return  this.http.get<PatientModel[]>(environment.api+"accounts/AllActivePatient");
  }
  // get all active accounts Doctors
  getAllActiveDoctor(searchKeyWord: string =""):Observable<MedecinModel[]>{
 let params = new HttpParams();
    params = params.append('searchKeyWord', searchKeyWord || ''); // add search keyword as a query parameter
 /**
 let params = new HttpParams();

      params = params.append('firstNameSearch', firstNameSearch || '');


      params = params.append('specialitySearch', specialitySearch || '');
  **/

    return  this.http.get<MedecinModel[]>(environment.api+"accounts/AllActiveDoctor", { params });
  }


  //delete Account
  deleteAccount(id : number):Observable<any>{
    return this.http.delete(`${this.UrlDelete}/${id}`);
  }

  //activate accounts patient
  activateAccountPatient(id: number):Observable<PatientModel>{
    return this.http.put<PatientModel>(`${this.UrlActivate}/${id}`, null);
  }

  //activate accounts doctor
  activateAccountDoctor(id: number):Observable<MedecinModel>{
    return this.http.put<MedecinModel>(`${this.UrlActivate}/${id}`, null);
  }

  //desactivate accounts doctor
  desactivateAccountDoctor(id: number):Observable<MedecinModel>{
    return this.http.put<MedecinModel>(`${this.UrlDesactivateD}/${id}`, null);
  }

  getActivateDoctor(id:number):Observable<MedecinModel>{
    return this.http.get<MedecinModel>(`${this.UrlgetActiveD}/${id}`);
  }

  getActivatePatient(id:number):Observable<PatientModel>{
    return this.http.get<PatientModel>(`${this.UrlgetActiveP}/${id}`);
  }
  loginMed(id: number) {
    return this.getActivateDoctor(id).pipe(
      map((user) => {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', 'JWT');
        return true;
      }),
      catchError((error) => {
        this.errorMessage = <any>error;
        return of(false);
      })
    );
  }


  searchDoctors(fistname: string): Observable<MedecinModel[]> {
    return this.http.get<MedecinModel[]>(environment.api+"accounts/search")

  }
  getCountPatientPerGender() {
    return this.http.get<Object[]>(environment.api+"accounts/count-patients-per-gender");
  }

  changePassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
    const body = {
      oldPassword: oldPassword,
      newPassword: newPassword
    };
    return this.http.put(`${environment.api}accounts/users/${email}/password`, body);
  }



  createAppointment(appointment: AppointmentRequest): Observable<any> {


    return this.http.post(environment.api+"Appointements/createAppointement", appointment);
  }

  getAllAppointments():Observable<AppointementResult[]>{
    return this.http.get<AppointementResult[]>(environment.api+"appointments/")
  }

  getAllAppointementByDcotorId(id:number):Observable<AppointementResult[]>{
    return this.http.get<AppointementResult[]>(`${this.urlApntmntByDoctor}/${id}`);
  }

  getAppointementById(id:string):Observable<AppointementResult>{
    return this.http.get<AppointementResult>(`${this.urlApntmntById}/${id}`);
  }

  getAllAppointementWithoutDcotorId():Observable<AppointementResult[]>{
    return this.http.get<AppointementResult[]>(environment.api+"appointments/appointmentsWithoutdoctor");
  }

  affecterMedecin(idAp: string, idD: UpdateAppointmentRequest):Observable<UpdateAppointmentRequest>{
    return this.http.put<UpdateAppointmentRequest>(`${this.urlAffecterMedecin}/${idAp}`,idD);
  }


  getRdvByPatient(id:string):Observable<AppointementResult[]>{
    return this.http.get<AppointementResult[]>(`${this.urlRdvPatient}/${id}`);
  }



  findMostFrequentSurgeryId(): Observable<string> {
    return this.http.get<string>(environment.api+"appointments/mostFrequentSurgeryId");
  }

  getDoctorCount(): Observable<number> {
    return this.http.get<number>(environment.api+'accounts/doctor-count');
  }
  getPatientCount(): Observable<number> {
    return this.http.get<number>(environment.api+'accounts/patient-count');
  }

  getChirurgieCount(): Observable<number> {
    return this.http.get<number>(environment.api+'chirurgies/chirurgie-count');
  }

  getAppointmentStatsByDoctor(doctorId: string): Observable<AppointmentStatsResult> {
    return this.http.get<AppointmentStatsResult>(environment.api+`appointments/getAppointmentStatsByDoctor/${doctorId}`);
  }

  getDoctorsByChirurgie(chirurgieId : string):Observable<MedecinModel[]>{
    return this.http.get<MedecinModel[]>(environment.api+`doctors/surgery/${chirurgieId}`);

  }
}

