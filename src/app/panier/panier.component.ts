import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../authentification.service';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { ProduitsService } from '../produits.service';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {
  private user: Observable<string>;
  private email: string;
   private Panier: Object[] = new Array();
  //private Panier = { "email": "", "produit": [] };

  constructor(private route: Router,
    private authService: AuthentificationService,
    private produitsService: ProduitsService) {
    this.route.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
   }

   this.route.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
         // trick the Router into believing it's last link wasn't previously loaded
         this.route.navigated = false;
         // if you need to scroll back to top, here is the right place
         window.scrollTo(0, 0);
         this.user = this.authService.getUser();
      }
  });
  this.user = this.authService.getUser();

  }

  ngOnInit() {
    console.log("init Panier component");
    this.authService.getUser().subscribe(value => {
      this.email = value;
      console.log("user mail Panier component" + this.email);
      this.produitsService.getPanier(this.email).subscribe(val => {
        this.Panier= val[0].produits;
        console.log(val);
      });
    });

  }

  validerPanier() {

    this.authService.getUser().subscribe(value => {
      this.email = value;
      console.log("user mail A valider le Panier" + this.email);
      this.produitsService.validerPanier(this.email).subscribe(val => console.log);
      window.alert("votre Panier a été validé"); 
      this.route.navigate(['/panier']);
   });

  }

  supprimerProduit(Produit)
  {
      console.log("user mail A supprimer Produit" + this.email);
      this.produitsService.validerPanier(this.email).subscribe(val => console.log);
      window.alert("votre Panier a été validé"); 
      this.route.navigate(['/panier']);

  }

}
