import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

const defaultOptions: any = {
  issuer: 'https://dev-737523.okta.com/oauth2/default',
  clientId: '0oaifymbuodpH8nAi0h7',
  framework: 'vue',
  skipPackageJson: true
};

describe('OktaDev Schematics: Vue', () => {
  it('requires required issuer option', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);

    expect(() => runner.runSchematic('add-auth', {}, Tree.empty())).toThrow();
  });

  it('works', (done) => {
    const files = ['/src/App.vue', '/src/router.js'];
    const runner = new SchematicTestRunner('schematics', collectionPath);
    runner.runSchematicAsync('add-auth', {...defaultOptions}, Tree.empty()).toPromise().then(tree => {
      files.forEach(file => {
        expect(tree.exists(file)).toEqual(true);
      });
      const routerContent = tree.readContent('/src/router.js');

      expect(routerContent).toMatch(/Auth\.handleCallback\(\)/);
      expect(routerContent).toContain(`issuer: '${defaultOptions.issuer}'`);
      expect(routerContent).toContain(`client_id: '${defaultOptions.clientId}'`);
      done();
    }, done.fail);
  });
});
