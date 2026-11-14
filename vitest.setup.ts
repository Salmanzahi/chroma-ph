/**
 * Vitest setup file — polyfills for browser APIs not available in jsdom.
 */

import { webcrypto } from "node:crypto";

// Polyfill crypto for environments that lack it
if (typeof globalThis.crypto === "undefined") {
  Object.defineProperty(globalThis, "crypto", {
    value: webcrypto,
    writable: true,
  });
}

// Polyfill ImageData for Node.js test environments.
// jsdom may not expose the ImageData constructor by default.
if (typeof globalThis.ImageData === "undefined") {
  class ImageDataPolyfill {
    readonly data!: Uint8ClampedArray;
    readonly width!: number;
    readonly height!: number;
    readonly colorSpace!: string;

    constructor(swOrData: number | Uint8ClampedArray, sh: number, settingsOrHeight?: number) {
      if (typeof swOrData === "number") {
        // Two-argument variant: new ImageData(width, height)
        this.width = swOrData;
        this.height = sh;
        this.data = new Uint8ClampedArray(swOrData * sh * 4);
        this.colorSpace = "srgb";
      } else {
        // Three-argument variant: new ImageData(data, width, height?)
        this.data = swOrData;
        this.width = sh;
        this.height = settingsOrHeight ?? 0;
        this.colorSpace = "srgb";
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).ImageData = ImageDataPolyfill;
}

// Configure React act environment for tests using react/act
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
