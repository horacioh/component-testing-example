import { MountOptions, MountReturn } from "cypress/react";
import { CustomMountOptions } from "../../src/test-utils";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Mounts a React node
       * @param component React Node to mount
       * @param options Additional options to pass into mount
       */
      mount(
        component: React.ReactNode,
        options?: MountOptions & CustomMountOptions
      ): Cypress.Chainable<MountReturn>;
    }
  }
}