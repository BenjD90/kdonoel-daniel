import { Injectable } from '@angular/core';
import * as moment from 'moment';
import _remove = require('lodash/remove');
import _isEmpty = require('lodash/isEmpty');

@Injectable()
export class DateUtilsService {

	getEarliestDate(date1: Date, date2: Date): Date {
		if (date1 && !date2) return date1;
		else if (!date1 && date2) return date2;
		else if (!date1 && !date2) return null;

		if (moment(date1).isBefore(moment(date2))) return date1;
		else return date2;
	}

	getLatestDate(date1: Date, date2: Date = new Date()): Date {
		if (date1 && !date2) return date1;
		else if (!date1 && date2) return date2;
		else if (!date1 && !date2) return null;

		if (moment(date1).isAfter(moment(date2))) return date1;
		else return date2;
	}

	getdisabledDates(startDate: Date, stopDate: Date): { date: Date, mode: string }[] {
		const disabledDates: { date: Date, mode: string }[] = [];
		let currentDate = startDate;
		if (!stopDate) {
			stopDate = moment().add(10, 'years').toDate();
		}
		while (moment(currentDate).isSameOrBefore(moment(stopDate))) {
			disabledDates.push({ date: new Date(currentDate), mode: 'day' });
			currentDate = moment(currentDate).add(1, 'days').toDate();
		}
		return disabledDates;
	}

	removeEarlierThan(dateArray: Date[], latestDate: Date): Date[] {
		return _remove(dateArray, (date) => {
			return moment(date).isSameOrAfter(moment(latestDate));
		});
	}

	getEarliestDateInArray(dates: Date[]): Date {
		return new Date(Math.min.apply(null, dates));
	}

	getEarliestDateAfterDate(dateArray: Date[], latestDate: Date): Date {
		const processedArray = this.removeEarlierThan(dateArray, latestDate);

		if (_isEmpty(processedArray)) return null;
		else return this.getEarliestDateInArray(processedArray);
	}

	toIsoDate(date: Date): Date {
		return new Date(date.toISOString());
	}

	getFisrtDayOfCurrentMonth(date: Date): Date {
		const year = date.getFullYear();
		const month = date.getMonth();
		return new Date(year, month, 1);
	}
}
