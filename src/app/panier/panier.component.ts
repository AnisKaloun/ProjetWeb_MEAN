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
  private Produit = { "email": "", "produit": "" };

  constructor(private route: Router,
    private authService: AuthentificationService,
    private produitsService: ProduitsService) {
    this.route.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }

    this.route.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        // trick the Router into believing it's last link wasn't previously loaded
        this.route.navigated = false;
        // if you need to scroll back to top, here is the right place
        window.scrollTo(0, 0);
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
        this.Panier = val[0].produits;
        console.log(val);
      });
    });

  }

  validerPanier() {
      console.log("user mail A valider le Panier" + this.email);
      window.alert("votre Panier a été validé");
      this.produitsService.validerPanier(this.email).subscribe(val => {
        this.route.navigate(['/panier']);
      });

  }

  supprimerProduit(Produit) {
    this.Produit['email'] = this.email;
    this.Produit['produit'] = Produit;
    console.log("user " + this.email + " A supprimer Produit" + Produit);
    this.produitsService.supprimerProduit(this.Produit).subscribe(val => {
      this.route.navigate(['/panier']);
    });
  }

  diminuerExemplaire(Produit) {
    if (Produit['nbrExemplaire'] > 1) {
      this.Produit['email'] = this.email;
      this.Produit['produit'] = Produit;
      console.log("user " + this.email + " A diminuer nbr d'exemplaire du Produit" + Produit);
      this.produitsService.diminuerExemplaire(this.Produit).subscribe(val => {
        this.route.navigate(['/panier']);
      });
    }

  }

  AugmenterExemplaire(Produit) {
    this.Produit['email'] = this.email;
    this.Produit['produit'] = Produit;
    console.log("user " + this.email + " A augmenter le nbr d'exemplaire du Produit" + Produit);
    this.produitsService.augmenterExemplaire(this.Produit).subscribe(val => {
      this.route.navigate(['/panier']);
    });

  }

}
