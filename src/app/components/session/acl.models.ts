export interface AclRequirement {
	perms: {
		action: string;
		user?: string;
	}[];
}
