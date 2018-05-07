import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {
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
  MatNativeDateModule, MatPaginatorModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule
} from "@angular/material";
import {LayoutModule} from "@angular/cdk/layout";

import {AppComponent} from './app.component';
import {PlaylistComponent} from './playlist/playlist.component';
import {PlaylistService} from "./playlist/playlist.service";
import {PlaylistDetailComponent} from "./playlist/playlist-detail.component";
import {SongComponent} from './song/song.component';
import {AlbumListComponent} from './album/album-list.component';
import {ArtistListComponent} from './artist/artist-list.component';
import {SongService} from "./song/song.service";
import {PlayerComponent} from './player/player.component';
import {PlayerService} from "./player/player.service";
import {DurationPipe} from "./shared/duration.pipe";
import {SongListComponent} from "./song/song-list.component";
import {AlbumService} from "./album/album.service";
import {ArtistService} from "./artist/artist.service";
import {AlbumCoverComponent} from "./album/album-cover.component";

export const routes: Routes = [
  { path: '', redirectTo: 'playlist', pathMatch: 'full' },
  { path: 'playlist', component: PlaylistComponent },
  { path: 'playlist/:id', component: PlaylistDetailComponent },
  { path: 'song', component: SongListComponent },
  { path: 'song/:type/:id', component: SongListComponent },
  { path: 'album', component: AlbumListComponent },
  { path: 'artist', component: ArtistListComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PlaylistComponent,
    PlaylistDetailComponent,
    SongComponent,
    SongListComponent,
    AlbumListComponent,
    AlbumCoverComponent,
    ArtistListComponent,
    PlayerComponent,
    DurationPipe
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
    MatPaginatorModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule
  ],
  providers: [
    PlaylistService,
    SongService,
    PlayerService,
    AlbumService,
    ArtistService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
