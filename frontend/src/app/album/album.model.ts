import {Paging} from "../shared/paging.model";

export class Album {
  constructor(public albumId: string, public title: string, public path: string) {}
}

export class AlbumCollection {
  constructor(public albums: Album[], public paging: Paging, public total: number) {}
}
