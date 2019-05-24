import { NgModule } from '@angular/core';
import { SharedEclesialModule } from '@app/base/module/shared-eclesial.module';
import { <%= classify(name) %>SearchComponent } from './<%= dasherize(name) %>-search.component';
import { ModalService } from '@app/base/service/modal.service';
import { <%= classify(name) %>Service } from '../service/<%= dasherize(name) %>.service';

@NgModule({
	imports: [
		SharedEclesialModule,
	],
	declarations: [
		<%= classify(name) %>SearchComponent,	
	],
	exports: [
		<%= classify(name) %>SearchComponent,		
	],
	providers: [
		<%= classify(name) %>Service,
		ModalService,
	],
	entryComponents: [
		<%= classify(name) %>SearchComponent,
	],
})
export class <%= classify(name) %>SearchModule { }