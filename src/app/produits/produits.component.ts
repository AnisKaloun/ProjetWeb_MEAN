import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { ProduitsService } from '../produits.service';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../authentification.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  private user: Observable<string>;
  private produits: Object[] = new Array();
  private ajoutPanier = { "email": "", "produit": [] };
  private email;

  constructor(private route: ActivatedRoute,
    private authService: AuthentificationService,
    private produitsService: ProduitsService) {
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    console.log("init produit component");
    this.route.params.subscribe((params: Params) => {
      console.log("Dans produits.component.ts avec " + params["categorie"]);
      if (params["categorie"] !== undefined) {
        console.log("/produits/" + params["categorie"]);
        this.produitsService.getProduitsParCategorie(params["categorie"]).subscribe(produits => {
          produits.sort((a, b) => (a.nom > b.nom) ? 1 : -1);
          this.produits = produits;
        });
      }
      else {

        this.produitsService.getProduits().subscribe(produits => {
          produits.sort((a, b) => (a.nom > b.nom) ? 1 : -1);
          this.produits = produits;
        });
      }
    });
    this.authService.getUser().subscribe(value => { 
      this.email=value;
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
