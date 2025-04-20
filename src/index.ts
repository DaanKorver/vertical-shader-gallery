import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { Media } from './core/media'
import { useSize } from './core/sizes'
import { getCurrentViewport } from './helpers/viewport'
import './style.css'

import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { animate, AnimationPlaybackControls } from 'motion'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { easeInOutExpo } from './core/easings'
import { useProgress } from './core/loader'

// Size
const sizes = useSize.current

// Renderer
const renderer = new WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

document.body.appendChild(renderer.domElement)

// Scene
const scene = new Scene()

// Camera
const camera = new PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 5

// Controls
const controls = new OrbitControls(camera, renderer.domElement)

// Viewport
const viewport = getCurrentViewport(camera)

// Lenis
const lenis = new Lenis({ infinite: false })
lenis.stop()
window.Lenis = lenis

// Loader
const loaderBarProgress = document.querySelector(
	'.loader-bar .progress'
) as HTMLDivElement

const loaderStore = useProgress()
let animation: AnimationPlaybackControls
let currentProgress = 0
loaderStore.subscribe(({ progress, ready }) => {
	if (ready) return
	if (animation) {
		animation.stop()
		currentProgress = progress
	}
	animation = animate(
		loaderBarProgress,
		{
			scaleX: currentProgress,
		},
		{
			delay: 0.3,
			duration: 1.6,
			ease: easeInOutExpo,
			onComplete() {
				if (progress === 1.0) {
					window.Lenis.scrollTo(0, {
						immediate: true,
						lock: true,
					})
					lenis.stop()

					animate(
						loaderBarProgress.parentElement!,
						{
							opacity: 0,
						},
						{
							onComplete() {
								loaderStore.setState({ ready: true })
								lenis.start()
								document.body.style.setProperty('overflow', 'initial')
							},
						}
					)
				}
			},
		}
	)
})

// Media
const items = document.querySelectorAll('.item')!
const mediaItems = Array.from(items).map((element, i) => {
	return new Media(element as HTMLElement, viewport, i)
})

mediaItems.forEach(item => {
	scene.add(item.mesh)
})

// Resizing
useSize.subscribe(({ width, height }) => {
	renderer.setSize(width, height)

	camera.aspect = width / height
	camera.updateProjectionMatrix()

	viewport.update()
})

// Render loop
function render(time: number) {
	lenis.raf(time)
	controls.update()

	mediaItems.forEach(item => {
		item.update(window.innerWidth, window.innerHeight)
	})

	renderer.render(scene, camera)

	requestAnimationFrame(render)
}
requestAnimationFrame(render)
