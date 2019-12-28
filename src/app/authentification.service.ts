import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions={
  headers:new HttpHeaders({
    "Access-Control-Allow-Methods" :"GET,POST",
    "Access-Control-Allow-Headers":"Content-type",
    "Content-Type":"application/json",
    "Access-Control-Allow-Origin":"*"
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private user:Subject<string>=new BehaviorSubject<string>(undefined);
  private baseURL: string="http://localhost:8888/";


  constructor(private http: HttpClient) { }

  getUser() {return this.user;}

  connect(data :string){this.user.next(data);}

  disconnect(){
    this.user.next(null);
  }

  getUserMail(){
    return this.user['email'];
  }

  verificationConnexion(identifiants):Observable<any> {
   return this.http.post(this.baseURL+'membres/connexion',JSON.stringify(identifiants),httpOptions);
   }

   inscription(identifiants):Observable<any>{
     console.log("inscription service"+JSON.stringify(identifiants));
    return this.http.post(this.baseURL+'membres/inscription',JSON.stringify(identifiants),httpOptions);
  }

}
