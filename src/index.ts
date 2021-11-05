import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { VRM } from '@pixiv/three-vrm'

window.addEventListener('DOMContentLoaded', () => {
  
  const renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.xr.enabled = true
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000)
  document.body.appendChild(renderer.domElement)
  document.body.appendChild( VRButton.createButton( renderer ) )

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
  )
  const cameraContainer = new THREE.Object3D()
  cameraContainer.add(camera)
  cameraContainer.position.set(0,1,3)
  scene.add(cameraContainer)

  const orbitControls = new OrbitControls(camera,renderer.domElement)
  orbitControls.screenSpacePanning = true
  
  const light = new THREE.DirectionalLight(0xffffff)
  light.position.set(1,1,1).normalize()
  scene.add(light)

  const loader = new GLTFLoader()
  loader.load(
    './assets/model.vrm',
    (gltf) => {
      VRM.from(gltf).then( (vrm) => {
        vrm.scene.scale.set(3, 3, 3)
        scene.add(vrm.scene);
        vrm.scene.rotation.y = Math.PI;
        vrm.scene.position.y -= 1;
      })
    }
  )

  const tick = (): void => {
    requestAnimationFrame(tick)
    renderer.setAnimationLoop(() => {
      orbitControls.update()
      renderer.render(scene, camera)
    })
  };
  tick();

  console.log('Hello Three.js');
});