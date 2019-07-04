import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { IBaseService } from '@app/base/interface/base.service.interface';
import { AppConfig } from '@app/config/app.config';

import { Add<%= classify(name) %>ViewModel } from '../viewmodel/<%= dasherize(name) %>.add.viewmodel';
import { Update<%= classify(name) %>ViewModel } from '../viewmodel/<%= dasherize(name) %>.update.viewmodel';

@Injectable()
export class <%= classify(name) %>Service implements IBaseService {

  private apiUrl: string = `${AppConfig.settings.env.apiUrlNew}v1/<%= tosimplelowcase(name) %>`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute) { }

  save(formGroup: FormGroup) {
    let entity = formGroup.value;

    if (entity.id > 0) {
      return this.http.put(`${this.apiUrl}`, entity);
    } else {
      return this.http.post(`${this.apiUrl}`, entity);
    }
  }

  add(viewModel: Add<%= classify(name) %>ViewModel) {
    return this.http.post(`${this.apiUrl}`, viewModel);
  }
  update(viewModel: Update<%= classify(name) %>ViewModel) {
    return this.http.put(`${this.apiUrl}`, viewModel);
  }

  getById(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}`, '');
  }

  getSearch(formGroup: FormGroup, pageNumber: number, organismoId: number, telaSistema: number) {
 
    let viewModel = {
      'pageNumber': pageNumber,
      'pageSize': 50,
      'telaSistema': telaSistema,
      'filterParameters': getFilterParameters(formGroup)
    };

    return this.http.post<any[]>(`${this.apiUrl}/search`, viewModel);
  }

  getLista() {
    return this.http.post(`${this.apiUrl}/getLista`, {});
  }

  delete(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
