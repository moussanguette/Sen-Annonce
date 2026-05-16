import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Composants (tous avec standalone: false)
import { AnnouncementListComponent } from './components/announcement-list/announcement-list.component';
import { AnnouncementFormComponent } from './components/announcement-form/announcement-form.component';
import { AnnouncementDetailComponent } from './components/announcement-detail/announcement-detail.component';
import { ModerationPanelComponent } from './components/moderation-panel/moderation-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    AnnouncementListComponent,    // Tous dans declarations
    AnnouncementFormComponent,
    AnnouncementDetailComponent,
    ModerationPanelComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    RouterModule,
    AppRoutingModule
    // NE PAS mettre les composants ici !!!
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }