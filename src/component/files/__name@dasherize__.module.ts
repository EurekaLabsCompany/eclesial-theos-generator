import { NgModule } from '@angular/core';
import { ModalService } from '@app/base/service/modal.service';
import { SharedEclesialModule } from '@app/base/module/shared-eclesial.module';
import { PermissionService } from '@app/config/app-permission.service';
import { <%= classify(name) %>Component } from './<%= dasherize(name) %>.component';
import { <%= classify(name) %>Service } from '../service/<%= dasherize(name) %>.service';
import { <%= classify(name) %>Application } from '../application/<%= dasherize(name) %>.application';
import { <%= classify(name) %>SearchModule } from '../search/<%= dasherize(name) %>-search-module';




@NgModule({
	imports: [
		SharedEclesialModule,
		<%= classify(name) %>SearchModule,				
	],
	declarations: [
		<%= classify(name) %>Component,
	],
	exports: [
	],
	providers: [
		ModalService,
		<%= classify(name) %>Service,
		<%= classify(name) %>Application,
		PermissionService
	],
})
export class <%= classify(name) %>Module { }
