/**
 * EduNova Official WebXR Session Service
 * Technical reference: https://github.com/immersive-web/webxr-samples
 */

import { getXRCapabilities } from './xrCapabilityService';

class XRSessionService {
  constructor() {
    this.session = null;
    this.referenceSpace = null;
    this.hitTestSource = null;
    this.inputSources = [];
    this.isVRActive = false;
    this.isARActive = false;
    this.onFrameCallback = null;
    this.onEndCallback = null;
    this.animFrameId = null;
  }

  async checkCapabilities() {
    return await getXRCapabilities();
  }

  /**
   * Request an immersive VR session (immersive-vr)
   */
  async startVRSession(onFrame, onSessionEnd) {
    if (!navigator.xr) {
      throw new Error('WebXR API is not available on this device or browser.');
    }

    const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
    if (!isSupported) {
      throw new Error('Immersive VR is not supported on this device.');
    }

    this.onFrameCallback = onFrame;
    this.onEndCallback = onSessionEnd;

    try {
      this.session = await navigator.xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['bounded-floor', 'hand-tracking']
      });

      this.isVRActive = true;
      this.session.addEventListener('end', () => this.handleSessionEnded());
      this.session.addEventListener('inputsourceschange', e => this.handleInputSourcesChange(e));

      // Reference Space selection chain
      try {
        this.referenceSpace = await this.session.requestReferenceSpace('local-floor');
      } catch {
        this.referenceSpace = await this.session.requestReferenceSpace('local');
      }

      // Start render loop
      this.session.requestAnimationFrame((t, f) => this.renderLoop(t, f));
      return { session: this.session, mode: 'immersive-vr' };
    } catch (err) {
      this.handleSessionEnded();
      throw err;
    }
  }

  /**
   * Request an immersive AR session (immersive-ar) with hit testing
   */
  async startARSession(domOverlayElement, onFrame, onSessionEnd) {
    if (!navigator.xr) {
      throw new Error('WebXR API is not available on this device or browser.');
    }

    const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
    if (!isSupported) {
      throw new Error('Immersive AR is not supported on this device.');
    }

    this.onFrameCallback = onFrame;
    this.onEndCallback = onSessionEnd;

    try {
      const sessionInit = {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: domOverlayElement ? { root: domOverlayElement } : undefined
      };

      this.session = await navigator.xr.requestSession('immersive-ar', sessionInit);
      this.isARActive = true;
      this.session.addEventListener('end', () => this.handleSessionEnded());
      this.session.addEventListener('inputsourceschange', e => this.handleInputSourcesChange(e));

      const viewerSpace = await this.session.requestReferenceSpace('viewer');
      this.referenceSpace = await this.session.requestReferenceSpace('local');

      try {
        this.hitTestSource = await this.session.requestHitTestSource({ space: viewerSpace });
      } catch (e) {
        console.warn('Hit test source unavailable:', e);
      }

      this.session.requestAnimationFrame((t, f) => this.renderLoop(t, f));
      return { session: this.session, mode: 'immersive-ar' };
    } catch (err) {
      this.handleSessionEnded();
      throw err;
    }
  }

  renderLoop(time, frame) {
    if (!this.session) return;

    const pose = frame.getViewerPose(this.referenceSpace);
    let hitTestResults = [];

    if (this.hitTestSource && this.referenceSpace) {
      hitTestResults = frame.getHitTestResults(this.hitTestSource);
    }

    if (this.onFrameCallback) {
      this.onFrameCallback({
        time,
        frame,
        pose,
        hitTestResults,
        session: this.session,
        refSpace: this.referenceSpace
      });
    }

    this.animFrameId = this.session.requestAnimationFrame((t, f) => this.renderLoop(t, f));
  }

  handleInputSourcesChange(event) {
    this.inputSources = Array.from(event.session.inputSources);
  }

  async endSession() {
    if (this.session) {
      try {
        await this.session.end();
      } catch (e) {
        console.warn('Session end error:', e);
      }
    }
  }

  handleSessionEnded() {
    if (this.hitTestSource) {
      try { this.hitTestSource.cancel(); } catch {}
      this.hitTestSource = null;
    }
    this.session = null;
    this.referenceSpace = null;
    this.isVRActive = false;
    this.isARActive = false;
    this.inputSources = [];

    if (this.onEndCallback) {
      this.onEndCallback();
    }
  }
}

export const xrSessionService = new XRSessionService();
export default xrSessionService;
