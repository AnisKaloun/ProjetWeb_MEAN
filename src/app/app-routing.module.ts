import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProduitsComponent } from './produits/produits.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { PanierComponent } from './panier/panier.component';


const routes: Routes = [
  {
    path: 'membres/connexion',
   component: ConnexionComponent
  },
  {
    path: 'categories',
   component: CategoriesComponent
  },
  {
    path: 'produits/:categorie',
   component: ProduitsComponent
  },
  {
    path: 'produits',
   component: ProduitsComponent
  },
  {
    path: 'inscription',
   component: InscriptionComponent
  },
  {
    path :'panier',
    component:PanierComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
