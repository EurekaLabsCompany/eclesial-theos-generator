import { filterTemplates } from './../schematics-utils/templates';
import { normalizeOptions } from './../schematics-utils/options';
import { totext, tovariable, tosimplelowcase, toconst } from './../schematics-utils/strings';
import { apply, Tree, SchematicContext , move, Rule, template, url, branchAndMerge } from '@angular-devkit/schematics';
import { chain, mergeWith } from '@angular-devkit/schematics';
import { dasherize, classify, decamelize} from "@angular-devkit/core/src/utils/strings";
import { proccessFoderPath } from '../schematics-utils/folder';

const stringUtils = {dasherize, classify, decamelize, totext, tovariable, toconst, tosimplelowcase};


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function searchInput(options: any): Rule {

  return (host: Tree, context: SchematicContext) => {
    options = normalizeOptions(options); 
    let resourceNameDasherized = dasherize(options.name);
    options = proccessFoderPath(`eclesial-input-search-${resourceNameDasherized}`, options, host);
   
        
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
