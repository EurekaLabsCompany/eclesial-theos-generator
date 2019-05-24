import { filterTemplates } from './../schematics-utils/templates';
import { tosimplelowcase, totext } from './../schematics-utils/strings';
import { getConditionalFieldConfig } from './../schematics-utils/fields';
import { apply, Tree, SchematicContext , move, Rule, template, url, branchAndMerge } from '@angular-devkit/schematics';
import { chain, mergeWith } from '@angular-devkit/schematics';
import { dasherize, classify} from "@angular-devkit/core/src/utils/strings";
import { normalizeOptions } from '../schematics-utils/options';
import { proccessFoderPath } from '../schematics-utils/folder';


const stringUtils = {dasherize, classify, tosimplelowcase, totext};
const fieldUtils = {getConditionalFieldConfig}


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function search(options: any): Rule {

  return (host: Tree, context: SchematicContext) => {
     options = normalizeOptions(options); 
     options = proccessFoderPath('search', options, host);
    
    const templateSource = apply(url('./files'), [
        filterTemplates(),
        template({
            ...fieldUtils,
            ...stringUtils,
            ...options
        }),
        move(options.folderPath)
      ]);     
    

      const rule = chain([
        branchAndMerge(chain([
          mergeWith(templateSource)
        ]))
      ]);

      return rule(host, context);
  }
  
  
}
