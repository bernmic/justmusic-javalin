export class Paging {
  constructor(public page: number,
              public size: number,
              public sort: string,
              public dir: string) {
  }
}
