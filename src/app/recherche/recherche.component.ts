import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProduitsService } from '../produits.service';
import { AuthentificationService } from '../authentification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recherche',
  templateUrl: './recherche.component.html',
  styleUrls: ['./recherche.component.css']
})
export class RechercheComponent implements OnInit {

  private Type;
  private message;
  private produits;
  private Request = { "categorie": "", "auteur": "", "prixMax": "", "prixMin": "", "nom": "" };
  private ajoutPanier = { "email": "", "produit": [] };
  private email;
  private user: Observable<string>;

  constructor(private router: Router, private produitsService: ProduitsService,
    private authService: AuthentificationService) {
    this.user = this.authService.getUser();

  }

  ngOnInit() {
    console.log("init Recherche component");

    this.produitsService.getCategories().subscribe(val => {
      this.Type = val;
      console.log(val);

    });
    this.authService.getUser().subscribe(value => {
      this.email = value;
    });
  }

  onSubmit() {
    this.produitsService.getProduitRecherche(this.Request).subscribe(value => {
      if (value['resultat'] == 0) {
        console.log("je suis con");
        this.message = "Pas de resultat veuillez réessayer";
        this.produits = null;
      }
      else {
        this.message = "";
        this.produits = value;
      }

    });
  
  }

  AjoutProduit(produit) {
    this.ajoutPanier['email'] = this.email;
     this.ajoutPanier['produit'] = produit;
     this.ajoutPanier['produit']['nbrExemplaire']=1;
     this.produitsService.ajoutProduit(this.ajoutPanier).subscribe(val => {
       window.alert("votre produit a était ajouté au Panier");
     });
     
 }


}
