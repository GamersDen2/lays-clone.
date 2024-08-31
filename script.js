import gsap from "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.168.0/+esm";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three-gltf-loader@1.111.0/index.min.js";
import { ScrollTrigger } from "https://cdnjs.cloudflare.com/ajax/libs/ScrollTrigger/1.0.6/ScrollTrigger.min.js";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// GSAP animations for navigation elements
gsap.from(".hero", { duration: 1,opacity:0, scale:0,  delay: 2})
gsap.from("nav", { duration: 1, y: -100 });
gsap.from("nav .icon", { duration: 1, opacity: 0, delay: 0.5, x: -50 });
gsap.from("nav .nav_buttons li", {
  duration: 1,
  opacity: 0,
  delay: 1,
  stagger: 0.2,
  y: -50,
});
gsap.from("nav .svg", { duration: 1, opacity: 0, delay: 1.5, y: -50 });
gsap.from(".lays", { duration: 1, opacity: 0, delay: 3, y: -50 });

// Scroll-triggered animation for .card elements
gsap.from(".swiper-card", {
  scrollTrigger: {
    trigger: ".swiper-container",
    start: "top 80%", // When the top of .products hits 80% of the viewport
    end: "bottom 20%", // When the bottom of .products reaches 20% of viewport height
    toggleActions: "play none none reverse", // Play on enter, reverse on leave
  },
  opacity: 0, // Starting opacity
  y: 50, // Starting y position (from below)
  stagger: 0.2, // Delay between each card's animation
  duration: 1, // Duration of the animation
});


// Three.js Scene Setup
const sizes = { width: window.innerWidth, height: window.innerHeight };
const lays_scene = new THREE.Scene();

// Camera setup
const lcamera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
lcamera.position.set(0, 0, 2); // Position the camera back so the model can be viewed
lays_scene.add(lcamera);

// Renderer setup
const lcanvas = document.querySelector(".lays");
const lrenderer = new THREE.WebGLRenderer({ canvas: lcanvas, alpha: true });
lrenderer.setSize(sizes.width, sizes.height);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
lays_scene.add(ambientLight);

const pointLightOnModel = new THREE.PointLight(0xffffff, 30, 100); // Bright white light
pointLightOnModel.position.set(0, 0, 5); // Position near the model
lays_scene.add(pointLightOnModel);

// Load the model using GLTFLoader
const loader = new GLTFLoader();
let model;

loader.load(
  'material/lays/scene.gltf', // Path to the 3D model
  function (gltf) {
    model = gltf.scene;
    lays_scene.add(model);
    model.position.set(0, 0, 0); // Set initial position
    model.rotation.set(0, 0, 0); // Set initial rotation
    model.scale.set(3, 3, 3); // Set scale
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error('An error occurred while loading the model:', error);
  }
);

// Mouse interaction for model tilt
let mouseX = 0;
let mouseY = 0;
const rotationStrength = 0.05; // Control tilt sensitivity

window.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) - 0.5; // Normalize mouse X (-0.5 to 0.5)
  mouseY = (event.clientY / window.innerHeight) - 0.5; // Normalize mouse Y (-0.5 to 0.5)
});

// Adjust camera aspect ratio and renderer size on window resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  lcamera.aspect = sizes.width / sizes.height;
  lcamera.updateProjectionMatrix();
  lrenderer.setSize(sizes.width, sizes.height);
});

// Animation loop for rendering the scene
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    // Apply rotation based on mouse movement
    model.rotation.y = mouseX * Math.PI * rotationStrength;
    model.rotation.x = mouseY * Math.PI * rotationStrength;
  }

  lrenderer.render(lays_scene, lcamera);
}

animate();


// cards swiper
document.addEventListener('DOMContentLoaded', () => {
  const cardsContainer = document.querySelector('.cards-container');
  const cards = document.querySelectorAll('.card');
  const cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(cards[0]).marginRight, 10);
  let currentIndex = 0;

  document.getElementById('b1').addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      cardsContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
  });

  document.getElementById('b2').addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      cardsContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
  });
});
