import { KdoState } from '../components/models/users/kdos.models';
import { User } from '../components/models/users/users.models';

export interface UserResult {
	user: User;
}

export interface StatusRequest {
	status: KdoState;
}
