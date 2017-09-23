/**
 * Created by bdaniel on 17/05/17
 */
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AclRequirement } from '../session/acl.models';
import { SessionService } from '../session/session.service';

/**
 * Show element if allowed only
 *
 * Sample of usage :
 * *alAcl="{ perms: [{ action: 'manageRoles' }] }"
 */
@Directive({selector: '[alAcl]'})
export class AclDirective {
	private hasView: boolean = false;

	constructor(
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
		private sessionService: SessionService) {
	}

	@Input() set alAcl(aclRequired: AclRequirement) {
		this.doCheck(aclRequired);

		this.sessionService.session$.subscribe(() => {
			this.doCheck(aclRequired);
		});
	}

	private doCheck(aclRequired: AclRequirement): void {
		const show = this.sessionService.checlAclAgainstSession(aclRequired);

		if (show && !this.hasView) {
			this.viewContainer.createEmbeddedView(this.templateRef);
			this.hasView = true;
		} else if (!show && this.hasView) {
			this.viewContainer.clear();
			this.hasView = false;
		}
	}
}
