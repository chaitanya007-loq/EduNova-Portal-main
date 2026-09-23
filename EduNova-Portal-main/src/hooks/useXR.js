import { useState, useEffect, useCallback } from 'react';
import { checkWebXRSupport, requestWebXRARHitTestSession, launchXRImmersiveSession } from '../services/xrService';

export const useXR = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [arSupported, setArSupported] = useState(false);
  const [deviceName, setDeviceName] = useState('Checking WebXR capabilities...');
  const [isInVRMode, setIsInVRMode] = useState(false);
  const [sessionDetails, setSessionDetails] = useState(null);

  useEffect(() => {
    let mounted = true;
    checkWebXRSupport().then(res => {
      if (mounted) {
        setIsSupported(res.supported);
        setArSupported(res.arSupported);
        setDeviceName(res.deviceName);
      }
    });
    return () => { mounted = false; };
  }, []);

  const enterARHitTest = useCallback(async (domElement) => {
    try {
      const arSession = await requestWebXRARHitTestSession(domElement);
      setSessionDetails(arSession);
      setIsInVRMode(true);
      return arSession;
    } catch (err) {
      console.warn('AR Hit Test Fallback:', err);
      return null;
    }
  }, []);

  const enterVR = useCallback(async () => {
    const details = await launchXRImmersiveSession();
    setSessionDetails(details);
    setIsInVRMode(true);
    return details;
  }, []);

  const exitVR = useCallback(() => {
    if (sessionDetails && sessionDetails.session) {
      sessionDetails.session.end().catch(e => console.warn(e));
    }
    setIsInVRMode(false);
    setSessionDetails(null);
  }, [sessionDetails]);

  return {
    isSupported,
    arSupported,
    deviceName,
    isInVRMode,
    sessionDetails,
    enterARHitTest,
    enterVR,
    exitVR
  };
};

export default useXR;
