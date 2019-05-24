# At a glance
Prepare the project to be linked

```bash
yarn install
yarn deploy
```

Navigate to your project folder and link

```bash
npm link eclesial
```

Now you are ready to use this generators
```bash
ng g eclesial:application
ng g eclesial:component
ng g eclesial:search
ng g eclesial:search-input
ng g eclesial:service
ng g eclesial:viewmodel

ng g eclesial:severino
```


# Getting Started With Schematics

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with
```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!
 