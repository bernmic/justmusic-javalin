import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import {
  MatButtonModule, MatCardModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatGridListModule,
  MatIconModule, MatInputModule, MatListModule,
  MatMenuModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
  MatSidenavModule, MatSortModule,
  MatTableModule,
  MatToolbarModule
} from "@angular/material";
import {LayoutModule} from "@angular/cdk/layout";

import { AppComponent } from './app.component';
import { PlaylistComponent } from './playlist/playlist.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

export const routes: Routes = [
  { path: '', redirectTo: 'playlist', pathMatch: 'full' },
  { path: 'playlist', component: PlaylistComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PlaylistComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    LayoutModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
