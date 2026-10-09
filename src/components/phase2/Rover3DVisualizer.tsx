import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface Rover3DVisualizerProps {
  isLightOn?: boolean;
  className?: string;
}

export const Rover3DVisualizer: React.FC<Rover3DVisualizerProps> = ({
  isLightOn = true,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const lightsRef = useRef<{
    left: THREE.PointLight;
    right: THREE.PointLight;
    mat: THREE.MeshStandardMaterial;
  } | null>(null);

  // Sync front LED searchlights when toggled in Quick Controls
  useEffect(() => {
    if (lightsRef.current) {
      lightsRef.current.left.intensity = isLightOn ? 3.0 : 0;
      lightsRef.current.right.intensity = isLightOn ? 3.0 : 0;
      lightsRef.current.mat.emissive.setHex(isLightOn ? 0xfde047 : 0x000000);
      lightsRef.current.mat.emissiveIntensity = isLightOn ? 2.0 : 0;
      lightsRef.current.mat.color.setHex(isLightOn ? 0xfef08a : 0x334155);
    }
  }, [isLightOn]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 360;
    let height = container.clientHeight || 300;

    // 1. Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    // Perspective Camera: FOV 34° for natural technical perspective
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    const BASE_DIST = 3.3;
    camera.position.set(0, 0.70, BASE_DIST);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false); // false = do not force inline pixel styles
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Ensure absolute canvas inside relative container to avoid flex measurement feedback loops
    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xe0f2fe, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(3.5, 5.0, 4.0);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    rimLight.position.set(-4.0, 3.0, -3.5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x94a3b8, 0.6);
    fillLight.position.set(0, -3.0, 2.0);
    scene.add(fillLight);

    // 3. Rover Model Construction
    // roverGroup: Root group for continuous 360° rotation around (0, 0, 0)
    const roverGroup = new THREE.Group();
    scene.add(roverGroup);

    // roverMeshGroup: Shifted vertically so the model's true center of mass is exactly at Y = 0
    const roverMeshGroup = new THREE.Group();
    roverMeshGroup.position.set(0, -0.23, 0);
    roverGroup.add(roverMeshGroup);

    // Materials
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x181e28,
      roughness: 0.35,
      metalness: 0.8,
    });
    const armorPlateMat = new THREE.MeshStandardMaterial({
      color: 0x242d3d,
      roughness: 0.25,
      metalness: 0.75,
    });
    const redAccentMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.3,
      metalness: 0.5,
    });
    const cyanTechMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.45,
      roughness: 0.2,
    });
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x0d1117,
      roughness: 0.85,
      metalness: 0.1,
    });
    const hubGoldMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      roughness: 0.3,
      metalness: 0.85,
    });
    const hubCapMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.9,
    });
    const searchlightMat = new THREE.MeshStandardMaterial({
      color: isLightOn ? 0xfef08a : 0x334155,
      emissive: isLightOn ? 0xfde047 : 0x000000,
      emissiveIntensity: isLightOn ? 2.0 : 0,
      roughness: 0.1,
    });

    // 3a. Main Lower Chassis Box
    const lowerChassis = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.30, 1.9), chassisMat);
    lowerChassis.position.y = 0.05;
    lowerChassis.castShadow = true;
    roverMeshGroup.add(lowerChassis);

    // 3b. Upper Armored Bay / Electronics Enclosure
    const upperChassis = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.28, 1.35), armorPlateMat);
    upperChassis.position.set(0, 0.29, -0.05);
    upperChassis.castShadow = true;
    roverMeshGroup.add(upperChassis);

    // Red Rescue Marking Stripes (left and right)
    const stripeLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 1.25), redAccentMat);
    stripeLeft.position.set(-0.43, 0.29, -0.05);
    roverMeshGroup.add(stripeLeft);

    const stripeRight = stripeLeft.clone();
    stripeRight.position.x = 0.43;
    roverMeshGroup.add(stripeRight);

    // 3c. Front Protective Bumper
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.16, 0.18), chassisMat);
    bumper.position.set(0, 0.02, 1.05);
    roverMeshGroup.add(bumper);

    // Ultrasonic Transducer Eyes (Front Obstacle Detection Sensor)
    const transducerGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.09, 16);
    transducerGeom.rotateX(Math.PI / 2);

    const transducerLeft = new THREE.Mesh(transducerGeom, cyanTechMat);
    transducerLeft.position.set(-0.16, 0.02, 1.15);
    roverMeshGroup.add(transducerLeft);

    const transducerRight = new THREE.Mesh(transducerGeom, cyanTechMat);
    transducerRight.position.set(0.16, 0.02, 1.15);
    roverMeshGroup.add(transducerRight);

    // 3d. Front Searchlights
    const lightHousingGeom = new THREE.CylinderGeometry(0.09, 0.11, 0.14, 16);
    lightHousingGeom.rotateX(Math.PI / 2);

    const lightHousingLeft = new THREE.Mesh(lightHousingGeom, chassisMat);
    lightHousingLeft.position.set(-0.34, 0.22, 0.95);
    roverMeshGroup.add(lightHousingLeft);

    const lightLensLeft = new THREE.Mesh(new THREE.CircleGeometry(0.08, 16), searchlightMat);
    lightLensLeft.position.set(-0.34, 0.22, 1.03);
    roverMeshGroup.add(lightLensLeft);

    const lightHousingRight = lightHousingLeft.clone();
    lightHousingRight.position.x = 0.34;
    roverMeshGroup.add(lightHousingRight);

    const lightLensRight = lightLensLeft.clone();
    lightLensRight.position.x = 0.34;
    roverMeshGroup.add(lightLensRight);

    // Dynamic Searchlight Point Lights (child of roverMeshGroup so they rotate with the rover)
    const searchLightLeft = new THREE.PointLight(0xfffbeb, isLightOn ? 3.0 : 0, 4.5);
    searchLightLeft.position.set(-0.34, 0.22, 1.2);
    roverMeshGroup.add(searchLightLeft);

    const searchLightRight = new THREE.PointLight(0xfffbeb, isLightOn ? 3.0 : 0, 4.5);
    searchLightRight.position.set(0.34, 0.22, 1.2);
    roverMeshGroup.add(searchLightRight);

    lightsRef.current = {
      left: searchLightLeft,
      right: searchLightRight,
      mat: searchlightMat,
    };

    // 3e. Top Mast with Rover Optical Camera
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.26, 12), chassisMat);
    mast.position.set(0, 0.54, 0.1);
    roverMeshGroup.add(mast);

    const cameraBody = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.18), armorPlateMat);
    cameraBody.position.set(0, 0.70, 0.12);
    roverMeshGroup.add(cameraBody);

    const cameraLensGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.08, 16);
    cameraLensGeom.rotateX(Math.PI / 2);
    const cameraLens = new THREE.Mesh(cameraLensGeom, cyanTechMat);
    cameraLens.position.set(0, 0.70, 0.21);
    roverMeshGroup.add(cameraLens);

    // 3f. Tubular Roll Bars (Front & Rear)
    const rollBarGeom = new THREE.CylinderGeometry(0.022, 0.022, 0.85, 8);
    rollBarGeom.rotateZ(Math.PI / 2);

    const rollBarFront = new THREE.Mesh(rollBarGeom, redAccentMat);
    rollBarFront.position.set(0, 0.48, 0.50);
    roverMeshGroup.add(rollBarFront);

    const rollBarRear = new THREE.Mesh(rollBarGeom, redAccentMat);
    rollBarRear.position.set(0, 0.48, -0.60);
    roverMeshGroup.add(rollBarRear);

    // 3g. Four Heavy-Duty Off-Road Wheels
    const tireGeom = new THREE.CylinderGeometry(0.30, 0.30, 0.22, 24);
    tireGeom.rotateZ(Math.PI / 2);

    const hubGeom = new THREE.CylinderGeometry(0.17, 0.17, 0.23, 16);
    hubGeom.rotateZ(Math.PI / 2);

    const capGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.24, 12);
    capGeom.rotateZ(Math.PI / 2);

    const wheelPositions = [
      { x: -0.74, z: 0.62 },  // Front Left
      { x: 0.74, z: 0.62 },   // Front Right
      { x: -0.74, z: -0.62 }, // Rear Left
      { x: 0.74, z: -0.62 },  // Rear Right
    ];

    wheelPositions.forEach((pos) => {
      // Knobby Tire
      const tire = new THREE.Mesh(tireGeom, tireMat);
      tire.position.set(pos.x, 0.0, pos.z);
      tire.castShadow = true;
      roverMeshGroup.add(tire);

      // Gold Alloy Hub
      const hub = new THREE.Mesh(hubGeom, hubGoldMat);
      hub.position.set(pos.x, 0.0, pos.z);
      roverMeshGroup.add(hub);

      // Center Hub Cap
      const cap = new THREE.Mesh(capGeom, hubCapMat);
      cap.position.set(pos.x, 0.0, pos.z);
      roverMeshGroup.add(cap);

      // Suspension Arm Connecting Wheel to Chassis
      const armLength = Math.abs(pos.x) - 0.55;
      const arm = new THREE.Mesh(new THREE.BoxGeometry(armLength, 0.06, 0.08), chassisMat);
      arm.position.set(pos.x * 0.72, 0.02, pos.z);
      roverMeshGroup.add(arm);
    });

    // 3h. Ground Contact Shadow Disc (positioned right underneath the tires)
    const shadowGeo = new THREE.CircleGeometry(1.35, 32);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.40,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.y = -0.31;
    roverMeshGroup.add(shadowMesh);

    // 4. Continuous 360° Rotation & Interactive Tilt Loop
    // Initial starting angle: ~35° yaw for attractive 3/4 perspective view
    let autoRotY = 0.55;
    let targetTiltX = 0; // subtle mouse parallax tilt
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let lastTime = performance.now();

    // Rotation speed: ~0.35 rad/sec (~18 seconds per full 360° continuous rotation)
    const ROTATION_SPEED = 0.35;
    const BASE_PITCH = 0.08; // slight downward pitch angle

    // Mouse Parallax Listeners (subtle, non-disruptive to continuous 360° orbit)
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      targetTiltX = normX * 0.32;
      targetTiltY = -normY * 0.16;
    };

    const handlePointerLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mouseleave', handlePointerLeave);

    // Touch support for tablets & mobile
    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const dx = (e.touches[0].clientX - touchStartX) / 120;
        const dy = (e.touches[0].clientY - touchStartY) / 120;
        targetTiltX = Math.max(-0.35, Math.min(0.35, dx * 0.35));
        targetTiltY = Math.max(-0.2, Math.min(0.2, -dy * 0.2));
      }
    };
    const handleTouchEnd = () => {
      targetTiltX = 0;
      targetTiltY = 0;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    // 5. Animation Loop
    let animId: number;
    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);

      const dt = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;

      // Continuous 360° rotation: Front -> Side -> Rear -> Side -> Front
      autoRotY += ROTATION_SPEED * dt;
      if (autoRotY > Math.PI * 2) {
        autoRotY -= Math.PI * 2;
      }

      // Smooth easing interpolation for subtle cursor tilt
      currentTiltX += (targetTiltX - currentTiltX) * 0.06;
      currentTiltY += (targetTiltY - currentTiltY) * 0.06;

      // Apply rotation to the root group
      roverGroup.rotation.y = autoRotY + currentTiltX;
      roverGroup.rotation.x = BASE_PITCH + currentTiltY;

      // Gentle, calm idle suspension breathing
      const breath = Math.sin(now * 0.0016) * 0.008;
      roverMeshGroup.position.y = -0.23 + breath;

      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(animate);

    // 6. Responsive Resize & Camera Framing
    const updateCameraFraming = (w: number, h: number) => {
      if (w <= 0 || h <= 0) return;
      const aspect = w / h;
      camera.aspect = aspect;

      // Adjust camera distance dynamically so the rover occupies 55-65% height
      // and never clips horizontally on narrower cards
      let dist = BASE_DIST;
      if (aspect < 1.15) {
        dist = BASE_DIST * (1.15 / aspect);
      }
      camera.position.set(0, 0.70, dist);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      renderer.setSize(w, h, false);
    };

    updateCameraFraming(width, height);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = entry.contentRect.width;
        const newH = entry.contentRect.height;
        if (newW > 0 && newH > 0) {
          updateCameraFraming(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup on unmount
    return () => {
      lightsRef.current = null;
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mouseleave', handlePointerLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full min-h-[260px] relative select-none cursor-grab active:cursor-grabbing ${className}`}
      title="RESQ-X 4WD Rover — Continuous 360° rotation with interactive parallax"
      aria-label="Interactive 3D RESQ-X Rover Model"
    />
  );
};
