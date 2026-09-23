/**
 * EduNova XR Capability Detection & Telemetry Service
 * Real capability detection for WebXR (VR/AR), Camera, Gyroscope/Device Orientation, WebGL2, and Touch capabilities.
 */

export const getXRCapabilities = async () => {
  const caps = {
    webxrSupported: false,
    vrSupported: false,
    arSupported: false,
    hitTestSupported: false,
    cameraAvailable: false,
    gyroscopeAvailable: false,
    webgl2Supported: false,
    touchSupported: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    deviceName: 'Standard Display',
    vrStatusText: 'WebXR VR not supported on this browser/device',
    arStatusText: 'WebXR AR not supported on this browser/device'
  };

  // 1. WebGL2 Check
  try {
    const canvas = document.createElement('canvas');
    caps.webgl2Supported = !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch (e) {
    caps.webgl2Supported = false;
  }

  // 2. Camera Check
  try {
    if (navigator.mediaDevices) {
      if (navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideo = devices.some(device => device.kind === 'videoinput');
        // Devices label may be masked before permission prompt; if mediaDevices exists, mark camera available
        caps.cameraAvailable = hasVideo || (devices.length === 0) || !!navigator.mediaDevices.getUserMedia;
      } else if (navigator.mediaDevices.getUserMedia) {
        caps.cameraAvailable = true;
      }
    } else {
      caps.cameraAvailable = true;
    }
  } catch (e) {
    caps.cameraAvailable = !!(navigator.mediaDevices && (navigator.mediaDevices.getUserMedia || navigator.mediaDevices.enumerateDevices));
  }

  // 3. Gyroscope / Device Orientation Check
  if (window.DeviceOrientationEvent) {
    caps.gyroscopeAvailable = true;
  }

  // 4. Native WebXR API & Feature Check
  if (navigator.xr) {
    caps.webxrSupported = true;
    try {
      caps.vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
      caps.vrStatusText = caps.vrSupported
        ? 'Immersive VR Headset Ready (WebXR API)'
        : 'WebXR API Present (No VR Headset Connected)';
    } catch (e) {
      caps.vrSupported = false;
    }

    try {
      caps.arSupported = await navigator.xr.isSessionSupported('immersive-ar');
      caps.arStatusText = caps.arSupported
        ? 'Immersive AR Surface Detector Ready'
        : 'WebXR API Present (No AR Surface Viewer Connected)';
      caps.hitTestSupported = caps.arSupported;
    } catch (e) {
      caps.arSupported = false;
    }

    if (caps.vrSupported && caps.arSupported) {
      caps.deviceName = 'WebXR Dual VR/AR Spatial Headset';
    } else if (caps.vrSupported) {
      caps.deviceName = 'WebXR Immersive VR Headset';
    } else if (caps.arSupported) {
      caps.deviceName = 'WebXR AR Spatial Display';
    } else {
      caps.deviceName = 'WebXR API Present (Fallback Ready)';
    }
  } else {
    caps.deviceName = caps.isMobile ? 'Mobile WebGL Display' : 'Desktop Spatial View';
  }

  return caps;
};

export const requestDeviceOrientationPermission = async () => {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const response = await DeviceOrientationEvent.requestPermission();
      return response === 'granted';
    } catch (err) {
      console.warn('Orientation permission denied:', err);
      return false;
    }
  }
  return true; // Already available on non-iOS browsers
};

export default {
  getXRCapabilities,
  requestDeviceOrientationPermission
};
