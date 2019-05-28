import { FormGroup } from '@angular/forms';


export class Add<%= classify(name) %>ViewModel { 
<%= fields.length > 0 ? getFieldsReferenceForViewModel(fields) : "public codigo: number; //TODO - Declare your fields here!" %>

    public organismoId: string;
    public telaSistema: string;
    

    constructor(formGroup: FormGroup) {
        <%= fields.length > 0 ? getFieldsSetterForViewModel(fields) : "this.codigo = formGroup.get('codigo').value;; //TODO - Set your fields here!" %>
        
        this.organismoId = formGroup.get('organismo').get('id').value;
        this.telaSistema = formGroup.get('telaSistema').value;
    }
}