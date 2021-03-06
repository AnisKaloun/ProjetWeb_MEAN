import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../authentification.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent  {

  private utilisateur={"email":"","password":""};
  private message: string = "";
  
  constructor(private authService: AuthentificationService, private router:Router)
  {
  }

 
  onSubmit(){
    console.log("in submit function");
    this.authService.verificationConnexion(this.utilisateur).subscribe(reponse => {
      this.message=reponse['message'];
      if(reponse['resultat']) {
        console.log("je suis co");
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
