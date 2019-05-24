import { BaseApplication } from '@app/base/component/base.application';
import { BaseComponent } from '@app/base/component/base.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StatusStateEnum } from '@app/base/enum/status-state.enum'
import { IBaseApplication } from '@app/base/interface/base.application.interface';
import { Injectable } from '@angular/core';
import { EclesialNotificationService } from '@app/base/service/eclesial-notification.service';
import { ErrorHandlerService } from '@app/base/service/error-handler.service';
import { LoaderUiStatic } from '@app/features/loader-ui/loader-ui.static';
import { <%= classify(name) %>Service } from '../service/<%= dasherize(name) %>.service';
import { Add<%= classify(name) %>ViewModel } from '../viewmodel/<%= dasherize(name) %>.add.viewmodel';
import { Update<%= classify(name) %>ViewModel } from '../viewmodel/<%= dasherize(name) %>.update.viewmodel';

@Injectable()
export class <%= classify(name) %>Application extends BaseApplication implements IBaseApplication {

	constructor(
		eclesialNotificationService: EclesialNotificationService,
		formBuilder: FormBuilder,
		private _service: <%= classify(name) %>Service,
		private _errorHandlerService: ErrorHandlerService,
	) {
		super(
			eclesialNotificationService,
			formBuilder,
		);
	}

	save(component: BaseComponent, formGroup: FormGroup, controlsDataTypes: any, isNew: boolean) {

		if (component.statusState === StatusStateEnum.Include) {

			LoaderUiStatic.open();

			let viewModel = new Add<%= classify(name) %>ViewModel(formGroup);

			this._service.add(viewModel).subscribe((data) => {

				this.mapperDataToFormGroup(data, formGroup, controlsDataTypes);

				if (isNew) {
					component.setIncludeState();
				} else {
					component.setViewState();
				}

				LoaderUiStatic.close();
				this.eclesialNotificationService.notifySuccess('Cadastrado com sucesso');

			}, (error) => {

				LoaderUiStatic.close();
				this._errorHandlerService.handle(error);

			});
		} else if (component.statusState === StatusStateEnum.Edit) {

			LoaderUiStatic.open();

			let viewModel = new Update<%= classify(name) %>ViewModel(formGroup);

			this._service.update(viewModel).subscribe((data) => {

				this.mapperDataToFormGroup(data, formGroup, controlsDataTypes);

				if (isNew) {
					component.setIncludeState();
				} else {
					component.setViewState();
				}

				LoaderUiStatic.close();
				this.eclesialNotificationService.notifySuccess('Atualizado com sucesso');

			}, (error) => {

				LoaderUiStatic.close();
				this._errorHandlerService.handle(error);

			});
		}
	}

	delete(component: BaseComponent, formGroup: FormGroup) {

		let id = formGroup.get('id').value;

		if (id !== undefined) {

			LoaderUiStatic.open();

			this._service.delete(id).subscribe((data) => {

				LoaderUiStatic.close();
				component.setIncludeState();
				this.eclesialNotificationService.notifySuccess('Registro excluído com sucesso');

			}, (error) => {

				LoaderUiStatic.close();
				this._errorHandlerService.handle(error);

			});
		}
	}

	getById(id: any, formGroup: FormGroup, controlsDataTypes: any) {
		return new Promise((resolve, reject) => {

			this._service.getById(id).subscribe(
				(data) => {

					this.mapperDataToFormGroup(data, formGroup, controlsDataTypes);
					resolve();
				},

				(error) => {

					this._errorHandlerService.handle(error);
					reject(error);

				},
			);
		});
	}
}
