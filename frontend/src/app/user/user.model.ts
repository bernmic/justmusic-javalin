import {Paging} from "../shared/paging.model";
import {Playlist} from "../playlist/playlist.model";

export class User {
  constructor(
    public id: string,
    public username: string,
    public role: string,
    public email: string
  ) {}
}

export class UserCollection {
  constructor(
    public users: User[],
    public paging: Paging,
    public total: number
  ) {}
}
