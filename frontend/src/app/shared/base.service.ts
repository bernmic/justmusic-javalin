import {Paging} from "./paging.model";
import {isNullOrUndefined} from "util";

export class BaseService {
  getPagingForUrl(paging?: Paging): string {
    let s = "";
    if (isNullOrUndefined(paging)) {
      return s;
    }
    if (!isNullOrUndefined(paging.sort)) {
      s += "sort=" + paging.sort;
      if (isNullOrUndefined(paging.dir)) {
        s += "&dir=asc";
      } else {
        s += "&dir=" + paging.dir;
      }
    }
    if (paging.size > 0) {
      if (s !== "") {
        s += "&";
      }
      s += "size=" + paging.size;
      if (paging.page > 0) {
        s += "&page=" + paging.page;
      }
    }
    if (s !== "") {
      s = "?" + s;
    }
    return s;
  }
}
