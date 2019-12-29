import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthentificationService } from '../authentification.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private user :Observable<string>;

  constructor(private authService: AuthentificationService,private router: Router)
   {
    this.user=this.authService.getUser();  
   }

  ngOnInit() {
    console.log("init menu");
    this.router.navigate(['/categories']);
  }

  deconnexion() {
    console.log("i'm disconnecting");
    this.router.navigate(['/categories']);
    this.authService.disconnect();
   // this.router.navigate(['/categories']);
  }

}
