import { filterTemplates } from './../schematics-utils/templates';
import { tosimplelowcase } from './../schematics-utils/strings';
import { normalizeOptions } from './../schematics-utils/options';
import { apply, Tree, SchematicContext , move, Rule, template, url, branchAndMerge } from '@angular-devkit/schematics';
import { chain, mergeWith } from '@angular-devkit/schematics';
import { dasherize, classify} from "@angular-devkit/core/src/utils/strings";
import { proccessFoderPath } from '../schematics-utils/folder';

const stringUtils = {dasherize, classify, tosimplelowcase};


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function service(options: any): Rule {

  return (host: Tree, context: SchematicContext) => {
    options = normalizeOptions(options); 
    options = proccessFoderPath('service', options, host);    

    
    const templateSource = apply(url('./files'), [
        filterTemplates(),
        template({
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
