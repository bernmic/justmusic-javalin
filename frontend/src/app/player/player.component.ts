import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Song} from "../song/song.model";
import {PlayerService} from "./player.service";
import {Howl} from "howler";
import {isNullOrUndefined} from "util";
import {Subscription} from "rxjs/index";
import {MatSlider, MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit {
  displayedColumns = ['title', 'duration'];
  songs: Song[];
  songListSubscription: Subscription;

  audio: Howl;
  currentSong: Song;
  volume = 100;
  position = 0;
  progress = 0;
  songPlaySubscription: Subscription;
  hoverPosition = 0;

  @Output() newSongLoaded: EventEmitter<Song> = new EventEmitter();

  @ViewChild("volumeCtrl")
  volumeControl: MatSlider ;

  constructor(private playerService: PlayerService, public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.songPlaySubscription = this.playerService.play$.subscribe(song => {
      this.playSong(song);
      this.openSnackBar(`Now playing ${song.title} from ${song.artist.name}`, "Show");
    });
    this.songListSubscription = this.playerService.listchange$.subscribe(songs => {
      this.songs = songs;
    });
  }

  ngAfterViewInit(): void {
    this.volumeControl.input.subscribe(event => {
      this.volumeChanged(event.value);
    });
  }

  ngOnDestroy(): void {
    this.songPlaySubscription.unsubscribe();
    this.songListSubscription.unsubscribe();
    this.volumeControl.input.unsubscribe();
  }

  songClicked(event, song: Song) {
    if (event.detail === 2) {
      this.playerService.playSong(song);
    }
  }

  isCurrentSong(song: Song): boolean {
    return this.currentSong === song;
  }

  playerReady(): boolean {
    return !isNullOrUndefined(this.audio);
  }

  play() {
    this.audio.play();
  }

  pause() {
    if (this.audio.playing()) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
  }

  stop() {
    this.audio.stop();
  }

  next() {
    this.playerService.nextSong();
  }

  previous() {
    this.playerService.previousSong();
  }
  cover(): string {
    if (isNullOrUndefined(this.currentSong)) {
      return "../assets/img/defaultAlbum.png";
    }
    return this.playerService.songCoverUrl(this.currentSong);
  }

  volumeChanged(volume) {
    this.volume = volume;
    if (!isNullOrUndefined(this.audio)) {
      this.audio.volume(this.volume / 100);
    }
  }

  canPlay(): boolean {
    return !isNullOrUndefined(this.currentSong);
  }

  isPlaying(): boolean {
    return !isNullOrUndefined(this.audio) && this.audio.playing();
  }

  isPaused(): boolean {
    return !isNullOrUndefined(this.audio) && !this.audio.playing() && this.position !== 0;
  }
  playSong(song: Song) {
    this.currentSong = song;
    if (!isNullOrUndefined(this.audio)) {
      this.audio.unload();
    }
    this.audio = new Howl({
      src: this.playerService.songStreamUrl(song),
      format: "mp3",
      volume: this.volume / 100,
      onend: soundId => this.next()
    });
    this.audio.play();
    setInterval(() => {
      const pos = this.audio.seek();
      this.position = (pos instanceof Howl) ? 0 : Math.round(pos);
      this.progress = (pos instanceof Howl) ? 0 : Math.round(pos * 100.0 / this.audio.duration());
    }, 1000);

    this.audio.on('load', (id) => {
      this.newSongLoaded.emit(song);
    });
  }

  seek(event) {
    const newPosition = this.calculateSongPosition(event.offsetX, event.srcElement.clientWidth.toFixed(0));
    this.audio.seek(newPosition);
  }

  setHoverPosition(event): void {
    this.hoverPosition = this.calculateSongPosition(event.offsetX, event.srcElement.clientWidth.toFixed(0));
  }

  private calculateSongPosition(position: number, size: number): number {
    if (this.canPlay()) {
      return Math.round(this.currentSong.duration * position / size);
    }
    return 0;
  }

  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
