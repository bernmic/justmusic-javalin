import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {
  MatBadgeModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule
} from "@angular/material";
import {LayoutModule} from "@angular/cdk/layout";

import {AppComponent} from './app.component';
import {PlaylistComponent} from './playlist/playlist.component';
import {PlaylistService} from "./playlist/playlist.service";
import {PlaylistDetailComponent} from "./playlist/playlist-detail.component";
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
import {UnixdatePipe} from "./shared/unixdate.pipe";
import {LoginComponent} from "./security/login.component";
import {AuthService} from "./security/auth.service";
import {AuthGuardService} from "./security/auth-guard.service";
import {TokenInterceptor} from "./security/token.interceptor";
import {PlaylistSelectDialogComponent} from "./song/playlist-select-dialog.component";
import {OverviewComponent} from "./overview/overview.component";
import {OverviewService} from "./overview/overview.service";
import {ScrollingModule} from "@angular/cdk/scrolling";

export const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'playlist', component: PlaylistComponent, canActivate: [AuthGuardService] },
  { path: 'playlist/:id', component: PlaylistDetailComponent, canActivate: [AuthGuardService] },
  { path: 'song', component: SongListComponent, canActivate: [AuthGuardService] },
  { path: 'song/:type/:id', component: SongListComponent, canActivate: [AuthGuardService] },
  { path: 'album', component: AlbumListComponent, canActivate: [AuthGuardService] },
  { path: 'artist', component: ArtistListComponent, canActivate: [AuthGuardService] },
  { path: 'overview', component: OverviewComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PlaylistComponent,
    PlaylistDetailComponent,
    PlaylistSelectDialogComponent,
    SongListComponent,
    AlbumListComponent,
    AlbumCoverComponent,
    ArtistListComponent,
    PlayerComponent,
    LoginComponent,
    OverviewComponent,
    DurationPipe,
    UnixdatePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    LayoutModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
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
    MatSnackBarModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatToolbarModule,
    ScrollingModule
  ],
  providers: [
    PlaylistService,
    SongService,
    PlayerService,
    AlbumService,
    ArtistService,
    OverviewService,
    AuthService,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [PlaylistSelectDialogComponent]
})
export class AppModule { }