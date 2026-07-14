/** Common types shared across the application. */

export type CameraStatus =
  | "idle"
  | "requesting"
  | "active"
  | "captured"
  | "permission-denied"
  | "not-supported"
  | "device-not-found"
  | "stopped"
  | "error";

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export type EligibilityStatus = "eligible" | "outside-range" | "unknown";

export type PhCategory = "acid" | "neutral" | "base";

export type ImageSource = "camera" | "upload";
