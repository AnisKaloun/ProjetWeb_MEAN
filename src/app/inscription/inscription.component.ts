import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent  {
  private utilisateur={"email":"","password":"","nom":"","prenom":""};
  private message: string = "";
  constructor(private authService :AuthentificationService,private router:Router) {}


  onSubmit(){
    console.log("in submit function");
    this.authService.inscription(this.utilisateur).subscribe(reponse => {
      this.message=reponse['message'];
      if(reponse['resultat']) {
        console.log("je suis inscrit");
        window.alert(this.message);
        this.authService.connect(this.utilisateur.email);
        this.router.navigate(['/categories']);
      }
      else
      {
        window.alert(this.message);
        console.log("reponse error");
      }
      setTimeout(()=> {this.router.navigate(['/categories']); }, 1000);
    });
  } 

}
