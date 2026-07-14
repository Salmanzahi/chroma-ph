# Camera Implementation — Bioplastic pH Scanner

**Date:** 2026-07-14

---

## 1. Hook: `useCamera`

Located at `src/features/scanner/hooks/useCamera.ts`.

### States

| State               | Meaning                                           |
| ------------------- | ------------------------------------------------- |
| `idle`             | Hook initialized, no camera requested              |
| `requesting`       | `getUserMedia` in progress                         |
| `active`           | Stream acquired, live preview available            |
| `captured`         | Frame captured, preview frozen                     |
| `permission-denied`| User denied or revoked camera permission           |
| `not-supported`    | `navigator.mediaDevices` unavailable (old browser)  |
| `device-not-found` | No camera hardware detected                        |
| `stopped`          | Camera stopped programmatically                     |
| `error`            | Unspecified camera error                           |

### Constraints

```typescript
{
  video: { facingMode: { ideal: "environment" } },
  audio: false
}
```

- Prefers rear/environment-facing camera.
- Does not request audio.
- Uses `playsInline` on the video element.
- No specific resolution or frame rate constraints.

---

## 2. Lifecycle

### Start

1. Feature detection: checks `navigator.mediaDevices?.getUserMedia`.
2. If unsupported, sets `not-supported` with guidance message.
3. Calls `stop()` to clean up any existing stream.
4. Calls `getUserMedia(constraints)`.
5. On success: sets `active`, stores stream in ref.
6. On `NotAllowedError` / `PermissionDeniedError`: sets `permission-denied`.
7. On `NotFoundError` / `DevicesNotFoundError`: sets `device-not-found`.
8. On other errors: sets `error` with generic message.

### Stop

1. Iterates `stream.getTracks()` and calls `.stop()` on each.
2. Sets ref to `null`.
3. Sets status to `stopped`.

### Cleanup Triggers

- **Unmount:** React `useEffect` cleanup.
- **Page hide:** `window.addEventListener("pagehide", ...)`.
- **Visibility change:** `document.addEventListener("visibilitychange", ...)` when hidden.
- **Explicit stop:** called before navigation away from `/scan`.

---

## 3. HTTPS and localhost

| Context               | Camera Works? | Notes                                      |
| --------------------- | ------------- | ------------------------------------------ |
| `http://localhost`    | Yes           | Browsers treat localhost as secure context |
| `http://127.0.0.1`   | Yes           | Same as localhost                          |
| `https://<domain>`   | Yes           | Production requirement                     |
| `http://<domain>`    | No            | Insecure context — `getUserMedia` blocked  |
| `file://`            | No            | Not a secure context                       |

---

## 4. Safari iOS Considerations

- `playsInline` attribute is required on the `<video>` element.
- `muted` attribute may be needed for autoplay.
- `getUserMedia` requires HTTPS except on localhost.
- Safari may limit resolution on some devices.
- The `facingMode` constraint is generally well-supported on iOS.

---

## 5. Upload Fallback

The `useImageUpload` hook provides an alternative when:

- The browser doesn't support `getUserMedia`.
- Camera permission is denied.
- No camera hardware is detected.
- The user prefers to use an existing photo.

### Validation

- **MIME types:** `image/jpeg`, `image/png`, `image/webp`
- **Max size:** 20 MB (configurable via `MAX_UPLOAD_SIZE_BYTES`)
- **Error messages:** Indonesian, specific to the validation failure
- **Preview:** Object URL created; revoked on clear/replace

---

## 6. Manual Camera Test Checklist

- [ ] Camera starts on explicit button click (not auto-start).
- [ ] Live video preview displays in viewfinder.
- [ ] Capture freezes preview and shows confirm/retake buttons.
- [ ] Retake returns to live camera view.
- [ ] Confirm runs analysis and navigates to `/result`.
- [ ] Camera indicator light turns off after navigation away from `/scan`.
- [ ] Camera stops when browser tab is backgrounded.
- [ ] Permission denial shows appropriate error with upload fallback.
- [ ] `not-supported` browser shows upload fallback.
- [ ] Upload fallback accepts JPEG, PNG, and WebP files.
- [ ] Upload rejects files over 20 MB.
- [ ] Upload rejects non-image files.
- [ ] Upload preview is displayed correctly.
- [ ] Retake after upload returns to live camera view.
- [ ] Camera restarts correctly after retake.
- [ ] Viewfinder aspect ratio (3:4) is maintained at all viewport sizes.
- [ ] Controls are accessible at 320px viewport width.

---

## 7. Known Limitations

1. **No exposure lock** — the camera continuously adjusts exposure, so the preview color may differ from the captured frame.
2. **No white-balance lock** — auto-WB shifts hues unpredictably across devices.
3. **Bounded analysis resolution** — frames are downscaled so the longest dimension is at most 1600 px; this limits memory use but may remove fine color variation.
4. **No orientation handling** — video may appear mirrored or rotated on some devices.
5. **No `navigator.permissions.query()`** — permission state is detected only via `getUserMedia` error handling.
