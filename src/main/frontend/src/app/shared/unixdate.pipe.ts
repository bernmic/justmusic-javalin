import {Pipe, PipeTransform} from "@angular/core";

@Pipe({name: "unixdate"})
export class UnixdatePipe implements PipeTransform {

  transform(value: number): Date {
    return new Date(value);
  }
}
