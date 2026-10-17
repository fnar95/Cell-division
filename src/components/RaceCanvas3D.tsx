import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Racer, RaceStage, AppTheme } from '../types/game';
import { THEMES } from '../data/themes';

interface RaceCanvas3DProps {
  racers: Racer[];
  playerRacer: Racer;
  isNitroActive: boolean;
  isSkiddingActive: boolean;
  stage: RaceStage;
  currentSpeed: number;
  themeId?: AppTheme;
}

export const RaceCanvas3D: React.FC<RaceCanvas3DProps> = ({
  racers,
  playerRacer,
  isNitroActive,
  isSkiddingActive,
  stage,
  currentSpeed,
  themeId = 'royal_gold'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const roadStripesRef = useRef<THREE.InstancedMesh | null>(null);
  const billboardsRef = useRef<THREE.Group[]>([]);
  const nitroParticlesRef = useRef<THREE.Points | null>(null);
  const skidParticlesRef = useRef<THREE.Points | null>(null);
  const finishArchRef = useRef<THREE.Group | null>(null);
  const speedLines3DRef = useRef<THREE.LineSegments | null>(null);
  const streakMetaRef = useRef<{
    speeds: Float32Array;
    lengths: Float32Array;
    count: number;
  } | null>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Speed-based offset
  const roadOffsetRef = useRef<number>(0);

  // Setup Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const themeColors = THEMES[themeId || 'royal_midnight'] || THEMES.royal_midnight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(themeColors.sceneFog, 0.012);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 5, -9);
    camera.lookAt(0, 1.5, 12);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      return;
    }
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mountRef.current.appendChild(renderer.domElement);

    // Ambient and directional lighting
    const ambientLight = new THREE.AmbientLight(0x223355, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xaaccff, 2.0);
    dirLight.position.set(15, 25, -10);
    scene.add(dirLight);

    // Stage-specific colored spotlight overhead
    const stageLight = new THREE.PointLight(themeColors.sceneLight, 3.2, 45);
    stageLight.position.set(0, 12, 10);
    scene.add(stageLight);

    // Road Ground
    const roadWidth = 26;
    const roadLength = 220;
    const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength, 1, 30);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x111625,
      roughness: 0.8,
      metalness: 0.2
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, roadLength / 2 - 20);
    scene.add(road);

    // Glowing Neon Guardrails
    const railGeo = new THREE.BoxGeometry(0.4, 0.8, roadLength);
    const leftRailMat = new THREE.MeshBasicMaterial({ color: themeColors.sceneRailLeft });
    const rightRailMat = new THREE.MeshBasicMaterial({ color: themeColors.sceneRailRight });
    const leftRail = new THREE.Mesh(railGeo, leftRailMat);
    const rightRail = new THREE.Mesh(railGeo, rightRailMat);
    leftRail.position.set(-roadWidth / 2, 0.4, roadLength / 2 - 20);
    rightRail.position.set(roadWidth / 2, 0.4, roadLength / 2 - 20);
    scene.add(leftRail);
    scene.add(rightRail);

    // Road dashed stripes (InstancedMesh for fast performance)
    const stripeCount = 40;
    const stripeGeo = new THREE.PlaneGeometry(0.35, 3.5);
    const stripeMat = new THREE.MeshBasicMaterial({ color: themeColors.sceneStripes });
    const stripes = new THREE.InstancedMesh(stripeGeo, stripeMat, stripeCount * 3);
    const dummy = new THREE.Object3D();
    dummy.rotation.x = -Math.PI / 2;

    const laneXs = [-4.5, 0, 4.5];
    let idx = 0;
    for (let lane = 0; lane < 3; lane++) {
      for (let i = 0; i < stripeCount; i++) {
        dummy.position.set(laneXs[lane], 0.02, i * 6 - 15);
        dummy.updateMatrix();
        stripes.setMatrixAt(idx++, dummy.matrix);
      }
    }
    stripes.instanceMatrix.needsUpdate = true;
    scene.add(stripes);
    roadStripesRef.current = stripes;

    // Science Billboard Arches over track
    const billboardTopics = [
      'الطور التمهيدي: تتكثف الكروموسومات وتظهر خيوط المغزل',
      'الطور الاستوائي: تصطف الكروموسومات على خط استواء الخلية',
      'الطور الانفصالي: ينفصل السنترومير وتتحرك الكروماتيدات للقطبين',
      'الطور النهائي: غلاف نووي جديد وانقسام السيتوبلازم',
      'دورة الخلية: تضاعف DNA في الطور البيني بدقة تامة'
    ];

    billboardsRef.current = [];
    billboardTopics.forEach((topicText, bIdx) => {
      const archGroup = new THREE.Group();
      // Pillars
      const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, 8);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
      const pLeft = new THREE.Mesh(pillarGeo, pillarMat);
      const pRight = new THREE.Mesh(pillarGeo, pillarMat);
      pLeft.position.set(-11, 4, 0);
      pRight.position.set(11, 4, 0);
      archGroup.add(pLeft, pRight);

      // Overhead banner board
      const boardGeo = new THREE.BoxGeometry(20, 2.5, 0.4);
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 140;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, 1024, 140);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 6;
        ctx.strokeRect(4, 4, 1016, 132);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 36px "Cairo", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(topicText, 512, 85);
      }
      const boardTex = new THREE.CanvasTexture(canvas);
      const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
      const board = new THREE.Mesh(boardGeo, boardMat);
      board.position.set(0, 7.5, 0);
      archGroup.add(board);

      archGroup.position.set(0, 0, 35 + bIdx * 45);
      scene.add(archGroup);
      billboardsRef.current.push(archGroup);
    });

    // Finish Arch
    const finishGroup = new THREE.Group();
    const fPillarGeo = new THREE.BoxGeometry(0.8, 10, 0.8);
    const fMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const fLeft = new THREE.Mesh(fPillarGeo, fMat);
    const fRight = new THREE.Mesh(fPillarGeo, fMat);
    fLeft.position.set(-11, 5, 0);
    fRight.position.set(11, 5, 0);
    finishGroup.add(fLeft, fRight);

    const fBoardGeo = new THREE.BoxGeometry(22, 2.8, 0.5);
    const fCanvas = document.createElement('canvas');
    fCanvas.width = 1024;
    fCanvas.height = 140;
    const fCtx = fCanvas.getContext('2d');
    if (fCtx) {
      fCtx.fillStyle = '#111827';
      fCtx.fillRect(0, 0, 1024, 140);
      // Checkered pattern on sides
      for (let i = 0; i < 16; i++) {
        fCtx.fillStyle = i % 2 === 0 ? '#ffffff' : '#000000';
        fCtx.fillRect(i * 30, 0, 30, 140);
        fCtx.fillRect(1024 - (i + 1) * 30, 0, 30, 140);
      }
      fCtx.fillStyle = '#fbbf24';
      fCtx.font = 'bold 44px "Orbitron", "Cairo", sans-serif';
      fCtx.textAlign = 'center';
      fCtx.fillText('🏁 خط النهاية - FINISH LINE 🏁', 512, 88);
    }
    const fTex = new THREE.CanvasTexture(fCanvas);
    const fBoard = new THREE.Mesh(fBoardGeo, new THREE.MeshBasicMaterial({ map: fTex }));
    fBoard.position.set(0, 9, 0);
    finishGroup.add(fBoard);
    finishGroup.position.set(0, 0, 9999); // Offscreen until near finish
    scene.add(finishGroup);
    finishArchRef.current = finishGroup;

    // Nitro exhaust particles (glowing flame points)
    const nitroCount = 180;
    const nitroGeo = new THREE.BufferGeometry();
    const nitroPositions = new Float32Array(nitroCount * 3);
    for (let i = 0; i < nitroCount * 3; i++) {
      nitroPositions[i] = (Math.random() - 0.5) * 0.5;
    }
    nitroGeo.setAttribute('position', new THREE.BufferAttribute(nitroPositions, 3));
    const nitroMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.35,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const nitroPoints = new THREE.Points(nitroGeo, nitroMat);
    nitroPoints.visible = false;
    scene.add(nitroPoints);
    nitroParticlesRef.current = nitroPoints;

    // Skid smoke particles
    const skidCount = 150;
    const skidGeo = new THREE.BufferGeometry();
    const skidPositions = new Float32Array(skidCount * 3);
    for (let i = 0; i < skidCount * 3; i++) {
      skidPositions[i] = (Math.random() - 0.5) * 1.2;
    }
    skidGeo.setAttribute('position', new THREE.BufferAttribute(skidPositions, 3));
    const skidMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.45,
      transparent: true,
      opacity: 0.7
    });
    const skidPoints = new THREE.Points(skidGeo, skidMat);
    skidPoints.visible = false;
    scene.add(skidPoints);
    skidParticlesRef.current = skidPoints;

    // 3D Speed Streaks in track corridor for high velocity
    const streakCount = 160;
    const streakPositions = new Float32Array(streakCount * 6);
    const streakSpeeds = new Float32Array(streakCount);
    const streakLengths = new Float32Array(streakCount);

    for (let i = 0; i < streakCount; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const x = side * (4.2 + Math.random() * 9.5);
      const y = 0.4 + Math.random() * 6.5;
      const z = Math.random() * 110 - 20;
      const len = 3.0 + Math.random() * 5.0;

      const idx = i * 6;
      streakPositions[idx] = x;
      streakPositions[idx + 1] = y;
      streakPositions[idx + 2] = z;
      streakPositions[idx + 3] = x;
      streakPositions[idx + 4] = y;
      streakPositions[idx + 5] = z + len;

      streakSpeeds[i] = 1.0 + Math.random() * 0.6;
      streakLengths[i] = len;
    }

    const streakGeo = new THREE.BufferGeometry();
    streakGeo.setAttribute('position', new THREE.BufferAttribute(streakPositions, 3));
    const streakMat = new THREE.LineBasicMaterial({
      color: themeColors.sceneSpeedStreaks,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const speedLines = new THREE.LineSegments(streakGeo, streakMat);
    scene.add(speedLines);
    speedLines3DRef.current = speedLines;
    streakMetaRef.current = {
      speeds: streakSpeeds,
      lengths: streakLengths,
      count: streakCount
    };

    // Initialize 2D fxCanvas size
    if (fxCanvasRef.current) {
      fxCanvasRef.current.width = width;
      fxCanvasRef.current.height = height;
    }

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (fxCanvasRef.current) {
        fxCanvasRef.current.width = w;
        fxCanvasRef.current.height = h;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (speedLines3DRef.current) {
        speedLines3DRef.current.geometry.dispose();
        (speedLines3DRef.current.material as THREE.Material).dispose();
      }
      carMeshesRef.current.clear();
      if (rendererRef.current && rendererRef.current.domElement && mountRef.current) {
        if (mountRef.current.contains(rendererRef.current.domElement)) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
    };
  }, [themeId]);

  // Update/Create 3D Cars for all Racers
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove obsolete car meshes
    carMeshesRef.current.forEach((mesh, id) => {
      if (!racers.find((r) => r.id === id)) {
        scene.remove(mesh);
        carMeshesRef.current.delete(id);
      }
    });

    // Create or update meshes
    racers.forEach((racer) => {
      let carGroup = carMeshesRef.current.get(racer.id);
      if (!carGroup) {
        carGroup = createCar3DMesh(racer);
        scene.add(carGroup);
        carMeshesRef.current.set(racer.id, carGroup);
      }
    });
  }, [racers]);

  // Animation Loop
  useEffect(() => {
    let lastTime = performance.now();
    const themeColors = THEMES[themeId || 'royal_midnight'] || THEMES.royal_midnight;

    const animate = (time: number) => {
      animFrameId.current = requestAnimationFrame(animate);
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      const scene = sceneRef.current;
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      if (!scene || !camera || !renderer) return;

      // Road scroll based on player's speed
      const speedFactor = Math.max(15, currentSpeed * 0.4);
      roadOffsetRef.current += speedFactor * delta;

      // Update stripes position
      const stripes = roadStripesRef.current;
      if (stripes) {
        const dummy = new THREE.Object3D();
        dummy.rotation.x = -Math.PI / 2;
        const laneXs = [-4.5, 0, 4.5];
        let idx = 0;
        for (let lane = 0; lane < 3; lane++) {
          for (let i = 0; i < 40; i++) {
            const z = ((i * 6 - roadOffsetRef.current) % 240 + 240) % 240 - 20;
            dummy.position.set(laneXs[lane], 0.02, z);
            dummy.updateMatrix();
            stripes.setMatrixAt(idx++, dummy.matrix);
          }
        }
        stripes.instanceMatrix.needsUpdate = true;
      }

      // Billboards motion
      billboardsRef.current.forEach((arch, bIdx) => {
        let bz = ((35 + bIdx * 45 - roadOffsetRef.current * 0.8) % 220 + 220) % 220 - 15;
        arch.position.z = bz;
      });

      // Finish Arch positioning near 100% progress
      if (finishArchRef.current) {
        if (playerRacer.progress >= 85) {
          const remainingDist = (100 - playerRacer.progress) * 4;
          finishArchRef.current.position.z = Math.max(5, remainingDist);
        } else {
          finishArchRef.current.position.z = 9999;
        }
      }

      // Update Cars positions & wheel rotation
      racers.forEach((racer) => {
        const carMesh = carMeshesRef.current.get(racer.id);
        if (!carMesh) return;

        // X lane coordinate (-8 to +8)
        const targetX = racer.lane * 4.2;
        carMesh.position.x = THREE.MathUtils.lerp(carMesh.position.x, targetX, 0.1);

        // Z relative position: player is fixed near z=2, rivals move ahead/behind based on relative progress
        let targetZ = 2;
        if (!racer.isPlayer) {
          const progressDiff = racer.progress - playerRacer.progress;
          // Scale difference into track depth (-15 to +40)
          targetZ = 2 + progressDiff * 1.5;
        }

        carMesh.position.z = THREE.MathUtils.lerp(carMesh.position.z, targetZ, 0.12);

        // Subtle car bounce on asphalt
        const bounce = Math.sin(time * 0.012 + racer.lane) * 0.03;
        carMesh.position.y = 0.35 + bounce;

        // Slight tilt when skidding
        if (racer.isSkidding) {
          carMesh.rotation.y = Math.sin(time * 0.03) * 0.25;
          carMesh.rotation.z = Math.cos(time * 0.03) * 0.08;
        } else {
          carMesh.rotation.y = THREE.MathUtils.lerp(carMesh.rotation.y, 0, 0.15);
          carMesh.rotation.z = THREE.MathUtils.lerp(carMesh.rotation.z, 0, 0.15);
        }

        // Rotate wheels
        carMesh.traverse((child) => {
          if (child.name === 'wheel') {
            child.rotation.x += (racer.currentSpeed * 0.1) * delta;
          }
        });
      });

      // Update 3D Speed Streaks based on player speed and nitro
      if (speedLines3DRef.current && streakMetaRef.current) {
        const streakCount = streakMetaRef.current.count;
        const streakSpeeds = streakMetaRef.current.speeds;
        const streakLengths = streakMetaRef.current.lengths;

        const speedRatio = Math.min(1, Math.max(0, (currentSpeed - 115) / 85));
        const effectiveSpeedRatio = isNitroActive ? Math.max(speedRatio, 0.85) : speedRatio;

        const lineMat = speedLines3DRef.current.material as THREE.LineBasicMaterial;
        lineMat.opacity = THREE.MathUtils.lerp(lineMat.opacity, effectiveSpeedRatio * 0.95, 0.1);
        speedLines3DRef.current.visible = lineMat.opacity > 0.02;

        if (speedLines3DRef.current.visible) {
          const posAttr = speedLines3DRef.current.geometry.attributes.position;
          const posArr = posAttr.array as Float32Array;
          const streakTravel = (speedFactor * 1.6 + effectiveSpeedRatio * 60) * delta;
          const lengthMultiplier = 1.0 + effectiveSpeedRatio * 2.2;

          for (let i = 0; i < streakCount; i++) {
            const idx = i * 6;
            posArr[idx + 2] -= streakTravel * streakSpeeds[i];
            const currentLen = streakLengths[i] * lengthMultiplier;
            posArr[idx + 5] = posArr[idx + 2] + currentLen;

            // When streak passes behind camera, wrap forward
            if (posArr[idx + 2] < -18) {
              const side = Math.random() > 0.5 ? 1 : -1;
              const newX = side * (4.2 + Math.random() * 9.5);
              const newY = 0.4 + Math.random() * 6.5;
              const newZ = 75 + Math.random() * 35;
              posArr[idx] = newX;
              posArr[idx + 1] = newY;
              posArr[idx + 2] = newZ;
              posArr[idx + 3] = newX;
              posArr[idx + 4] = newY;
              posArr[idx + 5] = newZ + currentLen;
            }
          }
          posAttr.needsUpdate = true;
        }
      }

      // Camera follow player's car
      const playerMesh = carMeshesRef.current.get(playerRacer.id);
      if (playerMesh) {
        // Dynamic camera follow, rumble & shake
        let camShakeX = 0;
        let camShakeY = 0;

        // High-speed rumble when speed > 135 km/h
        if (currentSpeed > 135) {
          const rumble = Math.min(1, (currentSpeed - 135) / 95) * 0.045;
          camShakeX += (Math.random() - 0.5) * rumble;
          camShakeY += (Math.random() - 0.5) * rumble;
        }

        if (isNitroActive) {
          camShakeX += (Math.random() - 0.5) * 0.1;
          camShakeY += (Math.random() - 0.5) * 0.1;
        } else if (isSkiddingActive) {
          camShakeX += (Math.random() - 0.5) * 0.22;
          camShakeY += (Math.random() - 0.5) * 0.15;
        }

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, playerMesh.position.x * 0.5 + camShakeX, 0.1);
        camera.position.y = 4.8 + camShakeY;
        camera.position.z = -9.5;
        camera.lookAt(playerMesh.position.x * 0.8, 1.8, 14);

        // Dynamic FOV zoom during high speed and nitro (perspective speed warp)
        const speedFovBoost = THREE.MathUtils.clamp((currentSpeed - 100) * 0.12, 0, 14);
        const targetFov = isNitroActive ? 73 : 60 + speedFovBoost;
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.1);
        camera.updateProjectionMatrix();

        // Position Nitro exhaust flames
        if (nitroParticlesRef.current) {
          nitroParticlesRef.current.visible = isNitroActive;
          if (isNitroActive) {
            nitroParticlesRef.current.position.set(playerMesh.position.x, playerMesh.position.y + 0.3, playerMesh.position.z - 2.2);
            const posAttr = nitroParticlesRef.current.geometry.attributes.position;
            const arr = posAttr.array as Float32Array;
            for (let i = 0; i < arr.length; i += 3) {
              arr[i + 2] -= 0.6; // Stream backwards
              if (arr[i + 2] < -3) {
                arr[i] = (Math.random() - 0.5) * 0.6;
                arr[i + 1] = (Math.random() - 0.5) * 0.3;
                arr[i + 2] = 0;
              }
            }
            posAttr.needsUpdate = true;
          }
        }

        // Position Skid smoke
        if (skidParticlesRef.current) {
          skidParticlesRef.current.visible = isSkiddingActive;
          if (isSkiddingActive) {
            skidParticlesRef.current.position.set(playerMesh.position.x, 0.2, playerMesh.position.z - 1.2);
            const posAttr = skidParticlesRef.current.geometry.attributes.position;
            const arr = posAttr.array as Float32Array;
            for (let i = 0; i < arr.length; i += 3) {
              arr[i + 1] += 0.05; // Smoke rises
              arr[i + 2] -= 0.3;
              if (arr[i + 1] > 2.0) {
                arr[i] = (Math.random() - 0.5) * 1.5;
                arr[i + 1] = 0.05;
                arr[i + 2] = (Math.random() - 0.5) * 0.5;
              }
            }
            posAttr.needsUpdate = true;
          }
        }
      }

      // Render 2D Dynamic Speed Lines & Motion Blur onto overlay canvas
      const fxCanvas = fxCanvasRef.current;
      if (fxCanvas) {
        const ctx = fxCanvas.getContext('2d');
        if (ctx) {
          const w = fxCanvas.width;
          const h = fxCanvas.height;
          ctx.clearRect(0, 0, w, h);

          const highSpeedThreshold = 118;
          const speedFactorRatio = Math.min(1, Math.max(0, (currentSpeed - highSpeedThreshold) / 85));
          const effectiveSpeed = isNitroActive ? Math.max(speedFactorRatio, 0.85) : speedFactorRatio;

          if (effectiveSpeed > 0.04) {
            const cx = w * 0.5;
            const cy = h * 0.44;
            const maxDim = Math.hypot(w, h);
            const minDim = Math.min(w, h);

            const r1 = (themeColors.sceneRailLeft >> 16) & 255;
            const g1 = (themeColors.sceneRailLeft >> 8) & 255;
            const b1 = themeColors.sceneRailLeft & 255;

            const r2 = (themeColors.sceneRailRight >> 16) & 255;
            const g2 = (themeColors.sceneRailRight >> 8) & 255;
            const b2 = themeColors.sceneRailRight & 255;

            // 1. Motion Blur Radial Peripheral Glow & Vignette
            const radGrad = ctx.createRadialGradient(cx, cy, minDim * 0.25, cx, cy, maxDim * 0.58);
            radGrad.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, 0)`);
            radGrad.addColorStop(0.55, `rgba(${r1}, ${g1}, ${b1}, ${effectiveSpeed * 0.09})`);
            radGrad.addColorStop(0.85, `rgba(${r2}, ${g2}, ${b2}, ${effectiveSpeed * 0.24})`);
            radGrad.addColorStop(1, `rgba(${r1}, ${g1}, ${b1}, ${effectiveSpeed * 0.42})`);
            ctx.fillStyle = radGrad;
            ctx.fillRect(0, 0, w, h);

            // 2. Peripheral Speed Blur Streaks (Lateral Motion Blur)
            const edgeBlurAlpha = effectiveSpeed * 0.35;
            const leftGrad = ctx.createLinearGradient(0, 0, w * 0.2, 0);
            leftGrad.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, ${edgeBlurAlpha})`);
            leftGrad.addColorStop(1, `rgba(${r1}, ${g1}, ${b1}, 0)`);
            ctx.fillStyle = leftGrad;
            ctx.fillRect(0, 0, w * 0.2, h);

            const rightGrad = ctx.createLinearGradient(w, 0, w * 0.8, 0);
            rightGrad.addColorStop(0, `rgba(${r2}, ${g2}, ${b2}, ${edgeBlurAlpha})`);
            rightGrad.addColorStop(1, `rgba(${r2}, ${g2}, ${b2}, 0)`);
            ctx.fillStyle = rightGrad;
            ctx.fillRect(w * 0.8, 0, w * 0.2, h);

            // 3. Dynamic Radial Speed Lines (Warp Speed Streaks)
            const numLines = Math.floor(32 + effectiveSpeed * 42);
            const innerRadius = minDim * (0.32 - effectiveSpeed * 0.08);
            const outerRadius = maxDim * 0.65;

            ctx.save();
            ctx.translate(cx, cy);

            for (let i = 0; i < numLines; i++) {
              // Distribute pseudo-random angles with time-based micro jitter
              const angle = (i / numLines) * Math.PI * 2 + Math.sin(i * 123.45 + time * 0.009) * 0.07;
              const cos = Math.cos(angle);
              const sin = Math.sin(angle);

              // Avoid directly covering the car cockpit
              if (sin > 0.82 && Math.abs(cos) < 0.32) continue;

              const lineLengthFactor = 0.5 + Math.random() * 0.5;
              const rStart = innerRadius + Math.random() * (minDim * 0.16);
              const rEnd = Math.min(outerRadius, rStart + (outerRadius - rStart) * lineLengthFactor * effectiveSpeed);

              const x1 = cos * rStart;
              const y1 = sin * rStart;
              const x2 = cos * rEnd;
              const y2 = sin * rEnd;

              const lineAlpha = (0.28 + Math.random() * 0.65) * effectiveSpeed;
              ctx.strokeStyle = i % 3 === 0
                ? `rgba(255, 255, 255, ${lineAlpha})`
                : i % 2 === 0
                ? `rgba(${r2}, ${g2}, ${b2}, ${lineAlpha * 0.9})`
                : `rgba(${r1}, ${g1}, ${b1}, ${lineAlpha * 0.95})`;

              ctx.lineWidth = 1.0 + Math.random() * (2.0 + effectiveSpeed * 2.2);
              ctx.lineCap = 'round';

              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
            }
            ctx.restore();

            // 4. Nitro High-Speed Shockwave Ring
            if (isNitroActive) {
              const ringRadius = (time * 0.35) % (minDim * 0.85);
              const ringAlpha = (1 - ringRadius / (minDim * 0.85)) * 0.4;
              ctx.strokeStyle = `rgba(${r1}, ${g1}, ${b1}, ${ringAlpha})`;
              ctx.lineWidth = 3.5;
              ctx.beginPath();
              ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
      }

      renderer.render(scene, camera);
    };

    animFrameId.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [racers, playerRacer, isNitroActive, isSkiddingActive, currentSpeed, themeId]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <div ref={mountRef} className="w-full h-full" />

      {/* Dynamic 2D Motion Blur & Speed Lines Canvas Overlay */}
      <canvas
        ref={fxCanvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full mix-blend-screen"
      />

      {/* Screen flash / tire burn on error */}
      {isSkiddingActive && (
        <div className="pointer-events-none absolute inset-0 bg-red-600/15 mix-blend-overlay transition-opacity duration-300" />
      )}
    </div>
  );
};

// Helper: build a sleek 3D sports car with wheels, underglow, spoiler, and headlights
function createCar3DMesh(racer: Racer): THREE.Group {
  const group = new THREE.Group();
  const primaryColor = new THREE.Color(racer.car.primaryColor || '#06b6d4');
  const accentColor = new THREE.Color(racer.car.accentColor || '#38bdf8');
  const neonColor = new THREE.Color(racer.car.neonColor || '#00f0ff');

  // Main Car Body (Chassis)
  const bodyGeo = new THREE.BoxGeometry(2.1, 0.65, 4.2);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: primaryColor,
    roughness: 0.25,
    metalness: 0.85
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.45;
  group.add(body);

  // Cabin / Windshield
  const cabinGeo = new THREE.BoxGeometry(1.6, 0.55, 2.0);
  const cabinMat = new THREE.MeshStandardMaterial({
    color: 0x0a0e17,
    roughness: 0.1,
    metalness: 0.95
  });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(0, 0.95, -0.2);
  group.add(cabin);

  // Aerodynamic Rear Wing / Spoiler
  const wingGeo = new THREE.BoxGeometry(2.0, 0.08, 0.5);
  const wingMat = new THREE.MeshStandardMaterial({ color: accentColor, metalness: 0.9 });
  const wing = new THREE.Mesh(wingGeo, wingMat);
  wing.position.set(0, 1.25, -1.9);

  const standGeo = new THREE.BoxGeometry(0.08, 0.35, 0.15);
  const standL = new THREE.Mesh(standGeo, wingMat);
  const standR = new THREE.Mesh(standGeo, wingMat);
  standL.position.set(-0.7, 1.05, -1.9);
  standR.position.set(0.7, 1.05, -1.9);
  group.add(wing, standL, standR);

  // Dual Exhaust Pipes
  const pipeGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.3, 12);
  const pipeMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 1 });
  const pipeL = new THREE.Mesh(pipeGeo, pipeMat);
  const pipeR = new THREE.Mesh(pipeGeo, pipeMat);
  pipeL.rotation.x = Math.PI / 2;
  pipeR.rotation.x = Math.PI / 2;
  pipeL.position.set(-0.45, 0.3, -2.15);
  pipeR.position.set(0.45, 0.3, -2.15);
  group.add(pipeL, pipeR);

  // Neon Underglow light plane
  const underglowGeo = new THREE.PlaneGeometry(2.4, 4.4);
  const underglowMat = new THREE.MeshBasicMaterial({
    color: neonColor,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  });
  const underglow = new THREE.Mesh(underglowGeo, underglowMat);
  underglow.rotation.x = Math.PI / 2;
  underglow.position.y = 0.05;
  group.add(underglow);

  // Headlights
  const lightGeo = new THREE.BoxGeometry(0.4, 0.15, 0.1);
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const headL = new THREE.Mesh(lightGeo, lightMat);
  const headR = new THREE.Mesh(lightGeo, lightMat);
  headL.position.set(-0.75, 0.5, 2.12);
  headR.position.set(0.75, 0.5, 2.12);
  group.add(headL, headR);

  // Taillights
  const tailGeo = new THREE.BoxGeometry(0.5, 0.15, 0.1);
  const tailMat = new THREE.MeshBasicMaterial({ color: 0xff1133 });
  const tailL = new THREE.Mesh(tailGeo, tailMat);
  const tailR = new THREE.Mesh(tailGeo, tailMat);
  tailL.position.set(-0.75, 0.5, -2.12);
  tailR.position.set(0.75, 0.5, -2.12);
  group.add(tailL, tailR);

  // 4 Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.35, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
  const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.36, 8);
  const rimMat = new THREE.MeshStandardMaterial({ color: accentColor, metalness: 0.9 });

  const wheelPositions = [
    [-1.05, 0.38, 1.2],
    [1.05, 0.38, 1.2],
    [-1.05, 0.38, -1.2],
    [1.05, 0.38, -1.2]
  ];

  wheelPositions.forEach(([x, y, z]) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.name = 'wheel';
    const tire = new THREE.Mesh(wheelGeo, wheelMat);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    tire.rotation.z = Math.PI / 2;
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(tire, rim);
    wheelGroup.position.set(x, y, z);
    group.add(wheelGroup);
  });

  // Name Tag Sprite above car
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = racer.isPlayer ? 'rgba(6, 182, 212, 0.9)' : 'rgba(15, 23, 42, 0.85)';
    ctx.roundRect ? ctx.roundRect(10, 8, 236, 48, 12) : ctx.rect(10, 8, 236, 48);
    ctx.fill();
    ctx.strokeStyle = racer.isPlayer ? '#ffffff' : '#94a3b8';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(racer.name, 128, 41);
  }
  const nameTex = new THREE.CanvasTexture(canvas);
  const spriteMat = new THREE.SpriteMaterial({ map: nameTex });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.position.set(0, 2.3, 0);
  sprite.scale.set(3.2, 0.8, 1);
  group.add(sprite);

  return group;
}
