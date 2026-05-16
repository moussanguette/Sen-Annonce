import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  title = 'SenAnnonces';
  showHero = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Cache le hero sur toutes les pages sauf l'accueil
        this.showHero = event.url === '/' || event.url === '/accueil';
        
        // Change le titre de la page
        if (event.url.includes('/annonces')) {
          document.title = 'Annonces - SenAnnonces';
        } else if (event.url.includes('/nouvelle')) {
          document.title = 'Publier une annonce - SenAnnonces';
        } else if (event.url.includes('/moderation')) {
          document.title = 'Modération - SenAnnonces';
        } else {
          document.title = 'SenAnnonces - Petites annonces au Sénégal';
        }
      }
    });
  }
}