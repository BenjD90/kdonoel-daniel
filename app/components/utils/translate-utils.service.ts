import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SweetAlertInputOptions } from 'sweetalert2';

@Injectable()
export class TranslateUtilsService {

	constructor(private translateService: TranslateService) {
	}

	translateSelectItems(prefix: string, keys: string[], sufix: string = '') {
		if (!keys) return;

		return this.translateService.get(prefix + keys[0] + sufix).map(() => {
			return keys.map((key) => {
				const selectItem = {
					id: key,
					text: this.translateService.instant(prefix + key + sufix)
				};
				return selectItem;
			});
		});
	}
}
