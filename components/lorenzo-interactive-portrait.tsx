"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";

type LorenzoInteractivePortraitProps = {
  revealImageUrl: string;
  forceReveal?: boolean;
  imageTargetSelector?: string;
  imageOffsetY?: number;
  active?: boolean;
  onReady?: () => void;
};

type RevealUniform = { value: number };

const blobVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const blobFragmentShader = `
  uniform float time;
  uniform float dTime;
  uniform float aspect;
  uniform float pointerDown;
  uniform float pointerRadius;
  uniform float pointerDuration;
  uniform vec2 pointer;
  uniform sampler2D prevFrame;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    float rVal = texture2D(prevFrame, vUv).r;
    rVal -= clamp(dTime / pointerDuration, 0.0, 0.05);
    rVal = clamp(rVal, 0.0, 1.0);

    float f = 0.0;
    if (pointerDown > 0.5) {
      vec2 uv = (vUv - 0.5) * 2.0 * vec2(aspect, 1.0);
      vec2 mouse = pointer * vec2(aspect, 1.0);
      vec2 toMouse = uv - mouse;
      float angle = atan(toMouse.y, toMouse.x);
      float dist = length(toMouse);

      float noiseVal = noise(vec2(angle * 3.0 + time * 0.5, dist * 5.0));
      float noiseVal2 = noise(vec2(angle * 5.0 - time * 0.3, dist * 3.0 + time));
      float radiusVariation = 0.7 + noiseVal * 0.5 + noiseVal2 * 0.3;
      float organicRadius = pointerRadius * radiusVariation;

      f = 1.0 - smoothstep(organicRadius * 0.05, organicRadius * 1.2, dist);
      f *= 0.8 + noiseVal * 0.2;
    }

    rVal += f * 0.25;
    rVal = clamp(rVal, 0.0, 1.0);
    gl_FragColor = vec4(vec3(rVal), 1.0);
  }
`;

const revealVertexShader = `
  varying vec2 vUv;
  varying vec4 vPosProj;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vPosProj = gl_Position;
  }
`;

const textureFragmentShader = `
  uniform sampler2D texBlob;
  uniform float time;
  uniform float fullReveal;
  uniform vec3 colorBg;
  uniform vec3 colorSoftShape;
  uniform vec3 colorLine;
  varying vec2 vUv;
  varying vec4 vPosProj;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.1;
      amplitude *= 0.3;
    }
    return value;
  }

  void main() {
    vec2 blobUV = ((vPosProj.xy / vPosProj.w) + 1.0) * 0.5;
    float blobValue = texture2D(texBlob, blobUV).r;
    float revealAlpha = max(step(0.02, blobValue), fullReveal);
    if (revealAlpha < 0.01) discard;

    vec2 uv = vUv * 3.5;
    vec2 distortionField = vUv * 2.0;
    float distortion = fbm(distortionField + time * 0.2);
    vec2 warpedUv = uv + (distortion - 0.5) * 0.7;
    float n = fbm(warpedUv);

    float softShapeMix = smoothstep(0.1, 0.9, sin(n * 3.0));
    vec3 baseColor = mix(colorBg, colorSoftShape, softShapeMix);
    float linePattern = fract(n * 15.0);
    float lineMix = 1.0 - smoothstep(0.49, 0.51, linePattern);
    vec3 finalColor = mix(baseColor, colorLine, lineMix);

    gl_FragColor = vec4(finalColor, revealAlpha);
  }
`;

const imageFragmentShader = `
  uniform sampler2D texBlob;
  uniform sampler2D map;
  uniform float fullReveal;
  varying vec2 vUv;
  varying vec4 vPosProj;

  void main() {
    vec2 blobUV = ((vPosProj.xy / vPosProj.w) + 1.0) * 0.5;
    float blobValue = texture2D(texBlob, blobUV).r;
    float revealAlpha = max(step(0.02, blobValue), fullReveal);
    if (revealAlpha < 0.01) discard;

    vec4 texColor = texture2D(map, vUv);
    gl_FragColor = vec4(texColor.rgb, texColor.a * revealAlpha);
  }
`;

class BlobTrail {
  output: THREE.WebGLRenderTarget;
  private previous: THREE.WebGLRenderTarget;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.Camera;
  readonly uniforms: {
    pointer: { value: THREE.Vector2 };
    pointerDown: { value: number };
    pointerRadius: { value: number };
    pointerDuration: { value: number };
    prevFrame: { value: THREE.Texture };
    time: { value: number };
    dTime: { value: number };
    aspect: { value: number };
  };

  constructor(
    private readonly renderer: THREE.WebGLRenderer,
    width: number,
    height: number,
    shared: {
      time: { value: number };
      dTime: { value: number };
      aspect: { value: number };
    },
  ) {
    const options: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      depthBuffer: false,
      stencilBuffer: false,
    };
    this.output = new THREE.WebGLRenderTarget(width, height, options);
    this.previous = new THREE.WebGLRenderTarget(width, height, options);
    this.uniforms = {
      pointer: { value: new THREE.Vector2(10, 10) },
      pointerDown: { value: 1 },
      pointerRadius: { value: 0.35 },
      pointerDuration: { value: 2.5 },
      prevFrame: { value: this.previous.texture },
      time: shared.time,
      dTime: shared.dTime,
      aspect: shared.aspect,
    };

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: blobVertexShader,
      fragmentShader: blobFragmentShader,
      depthTest: false,
      depthWrite: false,
    });
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
    this.camera = new THREE.Camera();
  }

  resize(width: number, height: number) {
    this.output.setSize(width, height);
    this.previous.setSize(width, height);
  }

  render() {
    this.renderer.setRenderTarget(this.output);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);

    const current = this.previous;
    this.previous = this.output;
    this.output = current;
    this.uniforms.prevFrame.value = this.previous.texture;
  }

  get texture() {
    return this.previous.texture;
  }

  dispose() {
    this.output.dispose();
    this.previous.dispose();
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
        else object.material.dispose();
      }
    });
  }
}

export function LorenzoInteractivePortrait({
  revealImageUrl,
  forceReveal = false,
  imageTargetSelector,
  imageOffsetY = 0,
  active = true,
  onReady,
}: LorenzoInteractivePortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealUniformRef = useRef<RevealUniform | null>(null);
  const initialForceReveal = useRef(forceReveal);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useGSAP(
    () => {
      const uniform = revealUniformRef.current;
      if (!uniform) return;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(uniform, {
        value: forceReveal ? 1 : 0,
        duration: reducedMotion ? 0.01 : 0.78,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    },
    { scope: containerRef, dependencies: [forceReveal] },
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const mountNode = container;
    const interactionTarget = container.parentElement ?? container;

    let width = Math.max(1, container.clientWidth);
    let height = Math.max(1, container.clientHeight);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shared = {
      time: { value: 0 },
      dTime: { value: 0 },
      aspect: { value: width / height },
    };
    const fullReveal: RevealUniform = { value: initialForceReveal.current ? 1 : 0 };
    revealUniformRef.current = fullReveal;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      0.1,
      1000,
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    renderer.domElement.className = "portrait-hero__webgl-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const blob = new BlobTrail(
      renderer,
      Math.round(width * pixelRatio),
      Math.round(height * pixelRatio),
      shared,
    );

    const backgroundMaterial = new THREE.ShaderMaterial({
      uniforms: {
        texBlob: { value: blob.output.texture },
        time: shared.time,
        fullReveal,
        colorBg: { value: new THREE.Vector3(0.965, 0.945, 0.925) },
        colorSoftShape: { value: new THREE.Vector3(0.965, 0.945, 0.925) },
        colorLine: { value: new THREE.Vector3(0.706, 0.239, 0.408) },
      },
      vertexShader: revealVertexShader,
      fragmentShader: textureFragmentShader,
      transparent: true,
      depthWrite: false,
    });
    const backgroundPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      backgroundMaterial,
    );
    backgroundPlane.position.z = 0.05;
    scene.add(backgroundPlane);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");
    let textureReady = false;
    let didNotifyReady = false;
    let disposed = false;
    const revealTexture = textureLoader.load(revealImageUrl, (texture) => {
      texture.colorSpace = THREE.NoColorSpace;
      updateImagePlane();
      textureReady = true;
    });
    revealTexture.colorSpace = THREE.NoColorSpace;

    const imageMaterial = new THREE.ShaderMaterial({
      uniforms: {
        texBlob: { value: blob.output.texture },
        map: { value: revealTexture },
        fullReveal,
      },
      vertexShader: revealVertexShader,
      fragmentShader: imageFragmentShader,
      transparent: true,
      depthWrite: false,
    });
    const imagePlane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), imageMaterial);
    imagePlane.position.z = 0.1;
    scene.add(imagePlane);

    function updateImagePlane() {
      const image = revealTexture.image as { width?: number; height?: number } | undefined;
      if (!image?.width || !image.height) return;

      const imageTarget = imageTargetSelector
        ? interactionTarget.querySelector<HTMLElement>(imageTargetSelector)
        : mountNode;
      const containerBounds = mountNode.getBoundingClientRect();
      const targetBounds = imageTarget?.getBoundingClientRect() ?? containerBounds;
      // The hero frame is scaled by ScrollTrigger. Normalise screen-space
      // measurements back into the canvas' untransformed coordinate system so
      // a resize/refresh during the closing sequence cannot offset the portrait.
      const scaleX = containerBounds.width > 0 ? width / containerBounds.width : 1;
      const scaleY = containerBounds.height > 0 ? height / containerBounds.height : 1;
      const targetWidth = Math.max(1, targetBounds.width * scaleX);
      const targetHeight = Math.max(1, targetBounds.height * scaleY);
      const targetLeft = (targetBounds.left - containerBounds.left) * scaleX;
      const targetTop = (targetBounds.top - containerBounds.top) * scaleY;
      const mobileScale = width < 700 ? 1.07 : width < 1024 ? 1.03 : 1;
      const scale = Math.min(targetWidth / image.width, targetHeight / image.height) * mobileScale;
      const planeWidth = image.width * scale;
      const planeHeight = image.height * scale;
      imagePlane.geometry.dispose();
      imagePlane.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
      imagePlane.position.x = targetLeft + targetWidth / 2 - width / 2;
      const imageCenterY = targetTop
        + targetHeight
        - planeHeight / 2
        + targetHeight * imageOffsetY;
      imagePlane.position.y = height / 2 - imageCenterY;
    }

    const manualPointer = new THREE.Vector2();
    const autoFrom = new THREE.Vector2();
    const autoTarget = new THREE.Vector2();
    let pointerInside = false;
    let autoStart = performance.now();
    let autoDuration = 3200;

    const chooseAutoTarget = (startTime: number) => {
      const current = blob.uniforms.pointer.value;
      if (Math.abs(current.x) > 2 || Math.abs(current.y) > 2) current.set(0, 0);
      autoFrom.copy(current);
      autoTarget.set(
        THREE.MathUtils.randFloat(-0.82, 0.82),
        THREE.MathUtils.randFloat(-0.68, 0.68),
      );
      autoStart = startTime;
      autoDuration = THREE.MathUtils.randFloat(2600, 4400);
    };
    chooseAutoTarget(autoStart);

    const updatePointer = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      manualPointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      manualPointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      pointerInside = true;
    };
    const resumeAutomaticMotion = () => {
      pointerInside = false;
      chooseAutoTarget(performance.now() + 500);
    };
    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") resumeAutomaticMotion();
    };
    interactionTarget.addEventListener("pointerenter", updatePointer);
    interactionTarget.addEventListener("pointermove", updatePointer);
    interactionTarget.addEventListener("pointerdown", updatePointer);
    interactionTarget.addEventListener("pointerleave", resumeAutomaticMotion);
    interactionTarget.addEventListener("pointerup", handlePointerUp);
    interactionTarget.addEventListener("pointercancel", resumeAutomaticMotion);

    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    visibilityObserver.observe(container);

    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      camera.left = width / -2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = height / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      shared.aspect.value = width / height;
      blob.resize(Math.round(width * pixelRatio), Math.round(height * pixelRatio));
      backgroundPlane.geometry.dispose();
      backgroundPlane.geometry = new THREE.PlaneGeometry(width, height);
      updateImagePlane();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const timer = new THREE.Timer();
    timer.connect(document);
    let animationFrame = 0;
    const animate = (timestamp: number) => {
      animationFrame = window.requestAnimationFrame(animate);
      timer.update(timestamp);
      const delta = timer.getDelta();
      if (!isVisible) return;
      if (textureReady && didNotifyReady && !activeRef.current) return;

      shared.time.value += delta;
      shared.dTime.value = delta;

      const pointer = blob.uniforms.pointer.value;
      if (pointerInside) {
        const smoothing = 1 - Math.exp(-delta * 11);
        pointer.lerp(manualPointer, smoothing);
      } else if (reducedMotion) {
        pointer.set(10, 10);
      } else {
        const now = performance.now();
        const progress = THREE.MathUtils.clamp((now - autoStart) / autoDuration, 0, 1);
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        pointer.lerpVectors(autoFrom, autoTarget, eased);
        if (progress >= 1) chooseAutoTarget(now);
      }

      blob.render();
      backgroundMaterial.uniforms.texBlob.value = blob.texture;
      imageMaterial.uniforms.texBlob.value = blob.texture;
      renderer.render(scene, camera);

      if (textureReady && !didNotifyReady) {
        didNotifyReady = true;
        window.requestAnimationFrame(() => {
          if (!disposed) onReady?.();
        });
      }
    };
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      timer.dispose();
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      interactionTarget.removeEventListener("pointerenter", updatePointer);
      interactionTarget.removeEventListener("pointermove", updatePointer);
      interactionTarget.removeEventListener("pointerdown", updatePointer);
      interactionTarget.removeEventListener("pointerleave", resumeAutomaticMotion);
      interactionTarget.removeEventListener("pointerup", handlePointerUp);
      interactionTarget.removeEventListener("pointercancel", resumeAutomaticMotion);
      revealUniformRef.current = null;
      blob.dispose();
      revealTexture.dispose();
      backgroundPlane.geometry.dispose();
      backgroundMaterial.dispose();
      imagePlane.geometry.dispose();
      imageMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [imageOffsetY, imageTargetSelector, onReady, revealImageUrl]);

  return <div ref={containerRef} className="portrait-hero__webgl" />;
}
