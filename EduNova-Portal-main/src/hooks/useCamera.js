import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook managing camera stream lifecycle, canvas frame capture,
 * permission status, and GUARANTEED track cleanup on component unmount.
 */
export const useCamera = (options = {}) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [streamActive, setStreamActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [permissionState, setPermissionState] = useState('unknown'); // 'prompt' | 'granted' | 'denied' | 'unavailable'
  const [capturedFrame, setCapturedFrame] = useState(null);
  const [facingMode, setFacingMode] = useState(options.facingMode || 'user');

  // Stop camera tracks explicitly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  }, []);

  // Initialize camera stream with robust fallback chain
  const startCamera = useCallback(async (overrideFacing) => {
    setError(null);
    const targetFacing = overrideFacing || facingMode;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionState('unavailable');
        throw new Error('Webcam API is not supported in this browser context (requires HTTPS or localhost).');
      }

      // Stop previous tracks if switching
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      let stream = null;

      // 1st Attempt: Target facingMode requested by user (user vs environment)
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: targetFacing }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
      } catch (err1) {
        console.log('Attempt 1 (facingMode ideal) failed, trying video: true:', err1);
        try {
          // 2nd Attempt: Generic video: true
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        } catch (err2) {
          console.log('Attempt 2 (video: true) failed, trying minimal fallback:', err2);
          try {
            // 3rd Attempt: Minimal low resolution
            stream = await navigator.mediaDevices.getUserMedia({
              video: { width: 640, height: 480 },
              audio: false
            });
          } catch (err3) {
            console.error('All camera acquisition attempts failed:', err3);
            throw err3;
          }
        }
      }

      if (!stream) {
        throw new Error('Failed to acquire valid camera media stream.');
      }

      streamRef.current = stream;

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        video.muted = true;
        
        video.onloadedmetadata = () => {
          video.play().catch(pErr => console.warn('Video element play() deferred:', pErr));
        };
        video.play().catch(playErr => console.warn('Direct play deferred:', playErr));
      }

      setStreamActive(true);
      setPermissionState('granted');
      setError(null);
    } catch (err) {
      console.warn('Camera stream activation error:', err);
      const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.toLowerCase().includes('denied');
      const isNotFound = err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError';
      
      if (isDenied) {
        setPermissionState('denied');
        setError('Webcam permission denied. Click the camera/lock icon in your browser address bar to allow camera access.');
      } else if (isNotFound) {
        setPermissionState('unavailable');
        setError('No physical webcam hardware detected. Operating in 3D Holographic Spatial Mode.');
      } else {
        setPermissionState('unavailable');
        setError(err.message || 'Camera stream unavailable. Operating in Holographic Spatial Mode.');
      }
      setStreamActive(false);
    }
  }, [facingMode]);

  // Switch facing camera (user <-> environment)
  const switchCamera = useCallback(() => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  }, [facingMode, startCamera]);

  // Continuously sync videoRef and play when stream is active
  useEffect(() => {
    if (streamActive && videoRef.current && streamRef.current) {
      const video = videoRef.current;
      if (video.srcObject !== streamRef.current) {
        video.srcObject = streamRef.current;
      }
      video.play().catch(e => console.warn('Stream sync play warning:', e));
    }
  }, [streamActive]);

  // Capture canvas snapshot frame
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !streamActive) {
      setCapturedFrame('simulated_frame_data');
      return 'simulated_frame_data';
    }

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    setCapturedFrame(dataUrl);
    return dataUrl;
  }, [streamActive]);

  // Lifecycle: Automatically clean up tracks on unmount
  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  return {
    videoRef,
    streamActive,
    isScanning,
    setIsScanning,
    error,
    permissionState,
    capturedFrame,
    facingMode,
    startCamera,
    stopCamera,
    switchCamera,
    captureFrame
  };
};

export default useCamera;
