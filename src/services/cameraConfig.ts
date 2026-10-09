/**
 * RESQ-X Camera Hardware Configuration
 *
 * Defines the physical ESP32-CAM rover stream endpoint.
 * When the real rover ESP32-CAM is powered and connected to the local network or Wi-Fi AP,
 * configure its MJPEG or HTTP stream URL here.
 *
 * Common hardware stream examples:
 * - Direct ESP32 AP mode:  "http://192.168.4.1/stream" or "http://192.168.4.1:81/stream"
 * - Local Wi-Fi router IP: "http://192.168.1.150:81/stream"
 * - mDNS hostname:         "http://resq-x-cam.local:81/stream"
 */
export const DEFAULT_ESP32_CAM_STREAM_URL = '';

export function isMobileBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth <= 768 && 'ontouchstart' in window)
  );
}
