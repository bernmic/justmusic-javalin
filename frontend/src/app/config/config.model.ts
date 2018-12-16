
export class Server {
  constructor(
    public port: number
  ) {}
}

export class Database {
  constructor(
    public username: string,
    public password: string,
    public schema: string,
    public type: string,
    public url: string
  ) {}
}

export class Media {
  constructor(
    public path: string,
    public syncfrequency: string,
    public syncatstart: boolean
  ) {}
}

export class Application {
  constructor(
    public mode: string,
    public loglevel: string,
    public cors: string
  ) {}
}

export class Config {
  constructor(
    public application: Application,
    public server: Server,
    public database: Database,
    public media: Media
  ) {}
}
