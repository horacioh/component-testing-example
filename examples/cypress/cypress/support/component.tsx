// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

import * as React from "react";
import { mount } from "cypress/react18";
import { MountOptions, MountReturn } from "cypress/react";
import { QueryClient } from "@tanstack/react-query";
import {
  createTestQueryClient,
  CustomMountOptions,
  TestProvider,
} from "../../src/test-utils";

// Alternatively you can use CommonJS syntax:

Cypress.Commands.add("mount", (component, options: CustomMountOptions = {}) => {
  let { client: customClient, path, ...mountOptions } = options;
  let client = customClient ?? createTestQueryClient().client;

  const wrapped = <TestProvider client={client}>{component}</TestProvider>;

  return mount(wrapped, mountOptions);
});

// Example use:
// cy.mount(<MyComponent />)
