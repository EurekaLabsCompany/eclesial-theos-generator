import { normalizeOptions } from './../schematics-utils/options';
import { Rule, externalSchematic } from '@angular-devkit/schematics';
import { chain} from '@angular-devkit/schematics';

export function severino(options: any): Rule {

  options = normalizeOptions(options);

  const chainGenerators:any[] = [];

  options.generators.map((g:string) => chainGenerators.push( externalSchematic('eclesial', g, options)));

  return () => {
      return chain(chainGenerators);
  }
  
  
}
