import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnouncementListComponent } from './components/announcement-list/announcement-list.component';
import { AnnouncementFormComponent } from './components/announcement-form/announcement-form.component';
import { AnnouncementDetailComponent } from './components/announcement-detail/announcement-detail.component';
import { ModerationPanelComponent } from './components/moderation-panel/moderation-panel.component';

const routes: Routes = [
  { path: '', redirectTo: '/annonces', pathMatch: 'full' },
  { path: 'annonces', component: AnnouncementListComponent },
  { path: 'annonces/:id', component: AnnouncementDetailComponent },
  { path: 'nouvelle', component: AnnouncementFormComponent },
  { path: 'moderation', component: ModerationPanelComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }