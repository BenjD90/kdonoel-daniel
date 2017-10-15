import { Pipe, PipeTransform } from '@angular/core';
import * as LinkifyStr from 'linkifyjs/string';

@Pipe({name: 'alLinkify'})
export class AlLinkifyPipe implements PipeTransform {
	transform(str: string): string {
		return str ? LinkifyStr(str) : str;
	}
}
