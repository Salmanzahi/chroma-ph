import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isMediaDevicesSupported,
  withTimeout,
  checkCameraPermission,
  checkCameraSupport,
  useCamera,
  type UseCameraReturn,
} from "./useCamera";
import React, { act } from "react";
import { createRoot } from "react-dom/client";

describe("useCamera and Camera Support", () => {
  const originalNavigator = globalThis.navigator;
  const originalIsSecureContext = window.isSecureContext;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(globalThis, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "isSecureContext", {
      value: originalIsSecureContext,
      writable: true,
      configurable: true,
    });
  });

  describe("isMediaDevicesSupported", () => {
    it("returns false if mediaDevices is undefined", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {},
        writable: true,
        configurable: true,
      });
      expect(isMediaDevicesSupported()).toBe(false);
    });

    it("returns false if getUserMedia is not a function", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: { mediaDevices: {} },
        writable: true,
        configurable: true,
      });
      expect(isMediaDevicesSupported()).toBe(false);
    });

    it("returns true if navigator.mediaDevices.getUserMedia is a function", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          mediaDevices: {
            getUserMedia: vi.fn(),
          },
        },
        writable: true,
        configurable: true,
      });
      expect(isMediaDevicesSupported()).toBe(true);
    });
  });

  describe("withTimeout", () => {
    it("resolves with promise value when completed before timeout", async () => {
      const fastPromise = new Promise<string>((resolve) =>
        setTimeout(() => resolve("success"), 10)
      );
      const result = await withTimeout(fastPromise, 100, "fallback");
      expect(result).toBe("success");
    });

    it("resolves with fallback value when promise takes longer than timeout", async () => {
      const hangingPromise = new Promise<string>(() => {
        // Never resolves
      });
      const result = await withTimeout(hangingPromise, 20, "fallback");
      expect(result).toBe("fallback");
    });

    it("resolves with fallback value when promise rejects", async () => {
      const failingPromise = Promise.reject(new Error("Network failure"));
      const result = await withTimeout(failingPromise, 50, "fallback");
      expect(result).toBe("fallback");
    });
  });

  describe("checkCameraPermission", () => {
    it("returns 'unknown' if navigator.permissions is unavailable", async () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {},
        writable: true,
        configurable: true,
      });
      const result = await checkCameraPermission(100);
      expect(result).toBe("unknown");
    });

    it("returns 'unknown' if permissions.query throws TypeError (Firefox / Safari)", async () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          permissions: {
            query: vi.fn().mockRejectedValue(new TypeError("camera not supported")),
          },
        },
        writable: true,
        configurable: true,
      });
      const result = await checkCameraPermission(100);
      expect(result).toBe("unknown");
    });

    it("returns permission state when query succeeds", async () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          permissions: {
            query: vi.fn().mockResolvedValue({ state: "denied" }),
          },
        },
        writable: true,
        configurable: true,
      });
      const result = await checkCameraPermission(100);
      expect(result).toBe("denied");
    });

    it("falls back to 'unknown' if query hangs past timeout", async () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          permissions: {
            query: vi.fn().mockReturnValue(new Promise(() => {})),
          },
        },
        writable: true,
        configurable: true,
      });
      const result = await checkCameraPermission(20);
      expect(result).toBe("unknown");
    });
  });

  describe("checkCameraSupport", () => {
    it("returns 'unsupported' with secure context hint when isSecureContext is false even if mediaDevices exists", async () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          mediaDevices: { getUserMedia: vi.fn() },
        },
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "isSecureContext", {
        value: false,
        writable: true,
        configurable: true,
      });

      const result = await checkCameraSupport(100);
      expect(result.status).toBe("unsupported");
      expect(result.isSecureContext).toBe(false);
      expect(result.errorMessage).toContain("HTTPS");
    });

    it("returns 'unsupported' when mediaDevices is missing in secure context", async () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {},
        writable: true,
        configurable: true,
      });
      Object.defineProperty(window, "isSecureContext", {
        value: true,
        writable: true,
        configurable: true,
      });

      const result = await checkCameraSupport(100);
      expect(result.status).toBe("unsupported");
      expect(result.hasMediaDevices).toBe(false);
      expect(result.errorMessage).toContain("tidak mendukung");
    });

    it("returns 'denied' when permissions API returns 'denied'", async () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          mediaDevices: { getUserMedia: vi.fn() },
          permissions: {
            query: vi.fn().mockResolvedValue({ state: "denied" }),
          },
        },
        writable: true,
        configurable: true,
      });

      const result = await checkCameraSupport(100);
      expect(result.status).toBe("denied");
      expect(result.hasMediaDevices).toBe(true);
      expect(result.permissionState).toBe("denied");
      expect(result.errorMessage).toContain("ditolak");
    });

    it("returns 'supported' when mediaDevices is available and permission is prompt", async () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          mediaDevices: { getUserMedia: vi.fn() },
          permissions: {
            query: vi.fn().mockResolvedValue({ state: "prompt" }),
          },
        },
        writable: true,
        configurable: true,
      });

      const result = await checkCameraSupport(100);
      expect(result.status).toBe("supported");
      expect(result.hasMediaDevices).toBe(true);
      expect(result.permissionState).toBe("prompt");
    });

    it("returns 'supported' when permissions query throws (Firefox / Safari)", async () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          mediaDevices: { getUserMedia: vi.fn() },
          permissions: {
            query: vi.fn().mockRejectedValue(new TypeError("camera not supported")),
          },
        },
        writable: true,
        configurable: true,
      });

      const result = await checkCameraSupport(100);
      expect(result.status).toBe("supported");
      expect(result.hasMediaDevices).toBe(true);
      expect(result.permissionState).toBe("unknown");
    });

    it("falls back to 'supported' without hanging when permissions API hangs", async () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          mediaDevices: { getUserMedia: vi.fn() },
          permissions: {
            query: vi.fn().mockReturnValue(new Promise(() => {})),
          },
        },
        writable: true,
        configurable: true,
      });

      const result = await checkCameraSupport(30);
      expect(result.status).toBe("supported");
      expect(result.hasMediaDevices).toBe(true);
    });
  });

  describe("useCamera hook lifecycle", () => {
    let container: HTMLDivElement;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it("transitions from checking to supported when mediaDevices is available", async () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          mediaDevices: { getUserMedia: vi.fn() },
          permissions: {
            query: vi.fn().mockResolvedValue({ state: "prompt" }),
          },
        },
        writable: true,
        configurable: true,
      });

      const hookRef = { current: null as UseCameraReturn | null };
      function TestComponent() {
        hookRef.current = useCamera();
        return React.createElement("div", null, hookRef.current.supportStatus);
      }

      const root = createRoot(container);
      await act(async () => {
        root.render(React.createElement(TestComponent));
      });

      // Initially starts checking or resolves quickly
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(hookRef.current?.supportStatus).toBe("supported");
      expect(hookRef.current?.status).toBe("idle");

      await act(async () => {
        root.unmount();
      });
    });

    it("transitions to unsupported and not-supported when mediaDevices is missing", async () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {},
        writable: true,
        configurable: true,
      });

      const hookRef = { current: null as UseCameraReturn | null };
      function TestComponent() {
        hookRef.current = useCamera();
        return React.createElement("div", null, hookRef.current.supportStatus);
      }

      const root = createRoot(container);
      await act(async () => {
        root.render(React.createElement(TestComponent));
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(hookRef.current?.supportStatus).toBe("unsupported");
      expect(hookRef.current?.status).toBe("not-supported");
      expect(hookRef.current?.errorMessage).toBeTruthy();

      await act(async () => {
        root.unmount();
      });
    });

    it("transitions to denied and permission-denied when permission is blocked", async () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          mediaDevices: { getUserMedia: vi.fn() },
          permissions: {
            query: vi.fn().mockResolvedValue({ state: "denied" }),
          },
        },
        writable: true,
        configurable: true,
      });

      const hookRef = { current: null as UseCameraReturn | null };
      function TestComponent() {
        hookRef.current = useCamera();
        return React.createElement("div", null, hookRef.current.supportStatus);
      }

      const root = createRoot(container);
      await act(async () => {
        root.render(React.createElement(TestComponent));
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(hookRef.current?.supportStatus).toBe("denied");
      expect(hookRef.current?.status).toBe("permission-denied");
      expect(hookRef.current?.errorMessage).toContain("ditolak");

      await act(async () => {
        root.unmount();
      });
    });

    it("handles start() requesting stream, stop(), and NotAllowedError cleanly", async () => {
      const mockTrack = {
        stop: vi.fn(),
        addEventListener: vi.fn(),
      };
      const mockStream = {
        getTracks: () => [mockTrack],
        getVideoTracks: () => [mockTrack],
      } as unknown as MediaStream;

      const mockGetUserMedia = vi.fn().mockResolvedValue(mockStream);

      Object.defineProperty(globalThis, "navigator", {
        value: {
          mediaDevices: { getUserMedia: mockGetUserMedia },
          permissions: {
            query: vi.fn().mockResolvedValue({ state: "prompt" }),
          },
        },
        writable: true,
        configurable: true,
      });

      const hookRef = { current: null as UseCameraReturn | null };
      function TestComponent() {
        hookRef.current = useCamera();
        return React.createElement("div", null, hookRef.current.status);
      }

      const root = createRoot(container);
      await act(async () => {
        root.render(React.createElement(TestComponent));
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      // Start camera
      await act(async () => {
        await hookRef.current?.start();
      });

      expect(hookRef.current?.status).toBe("active");
      expect(hookRef.current?.stream).toBe(mockStream);

      // Stop camera
      await act(async () => {
        hookRef.current?.stop();
      });

      expect(hookRef.current?.status).toBe("stopped");
      expect(hookRef.current?.stream).toBeNull();
      expect(mockTrack.stop).toHaveBeenCalled();

      // Now test start() error (NotAllowedError)
      mockGetUserMedia.mockRejectedValueOnce(
        new DOMException("Permission denied", "NotAllowedError")
      );

      await act(async () => {
        await hookRef.current?.start();
      });

      expect(hookRef.current?.status).toBe("permission-denied");
      expect(hookRef.current?.supportStatus).toBe("denied");
      expect(hookRef.current?.errorMessage).toContain("ditolak");

      await act(async () => {
        root.unmount();
      });
    });
  });
});
