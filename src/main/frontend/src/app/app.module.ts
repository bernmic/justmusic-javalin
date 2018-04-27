import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
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
import { PlaylistService } from "./playlist/playlist.service";
import {PlaylistDetailComponent} from "./playlist/playlist-detail.component";
import { SongComponent } from './song/song.component';
import { AlbumComponent } from './album/album.component';
import { ArtistComponent } from './artist/artist.component';
import {SongService} from "./song/song.service";
import { PlayerComponent } from './player/player.component';

export const routes: Routes = [
  { path: '', redirectTo: 'playlist', pathMatch: 'full' },
  { path: 'playlist', component: PlaylistComponent },
  { path: 'playlist/:id', component: PlaylistDetailComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PlaylistComponent,
    PlaylistDetailComponent,
    SongComponent,
    AlbumComponent,
    ArtistComponent,
    PlayerComponent
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
  providers: [
    PlaylistService,
    SongService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
