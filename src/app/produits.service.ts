import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    "Access-Control-Allow-Methods": "GET,POST",
    "Access-Control-Allow-Headers": "Content-type",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  })
};


@Injectable({
  providedIn: 'root'
})
export class ProduitsService {

  private urlBase: string = 'http://localhost:8888/';

  constructor(private http: HttpClient,
  ) { }

  getProduits(): Observable<any> {
    return this.http.get(this.urlBase + 'produits');
  }

  getCategories(): Observable<any> {
    return this.http.get(this.urlBase + 'categories');
  }

  getProduitsParCategorie(categorie): Observable<any> {
    return this.http.get(this.urlBase + 'produits/' + categorie);
  }

  ajoutProduit(produit): Observable<any> {
    console.log("ajout Produit service" + JSON.stringify(produit));
    return this.http.post(this.urlBase + 'Panier/ajout', JSON.stringify(produit), httpOptions);
  }

  getPanier(user): Observable<any> {
    return this.http.get(this.urlBase + 'Panier/' + user);
  }

  validerPanier(user): Observable<any> {
    return this.http.get(this.urlBase + 'Panier/valider/' + user);
  }

  supprimerProduit(Produit) {
    console.log("Service :suppresion Produit du Panier" + JSON.stringify(Produit['produit']));
    return this.http.post(this.urlBase + 'Panier/delete', JSON.stringify(Produit), httpOptions);
    
  }

  getProduitRecherche(Produit) {
    console.log("Service:RechercheProduit avec critere"+JSON.stringify(Produit)) 
    return this.http.post(this.urlBase+'Recherche',JSON.stringify(Produit),httpOptions);
  }

  diminuerExemplaire(Produit){
    console.log("Service :Diminution Produit du Panier" + JSON.stringify(Produit['produit']));
    return this.http.post(this.urlBase + 'Panier/diminuerExemplaire', JSON.stringify(Produit), httpOptions);
  

  }

  augmenterExemplaire(Produit)
  {
    console.log("Service :augmentation Produit du Panier" + JSON.stringify(Produit['produit']));
    return this.http.post(this.urlBase + 'Panier/augmenterExemplaire', JSON.stringify(Produit), httpOptions);
  
  }

}
