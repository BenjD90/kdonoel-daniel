
export interface BasePerson {
	firstName: string;
	lastName1?: string;
	lastName2?: string;
	birthDate?: Date;
}

export interface User extends BasePerson {
	_id?: string;
	fullName?: string;
	gender?: string;
	email?: string;
	language: string;
}
