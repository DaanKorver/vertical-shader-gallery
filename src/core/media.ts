import { animate } from 'motion'
import { Mesh, PlaneGeometry, ShaderMaterial, Uniform, Vector2 } from 'three'
import { useProgress, useTexture } from './loader'

import { lerp } from 'three/src/math/MathUtils.js'
import { fit } from '../helpers/fit'
import { easeOutExpo } from './easings'
import fragmentShader from './shaders/image.frag'
import vertexShader from './shaders/image.vert'

export class Media {
	element: HTMLElement
	material: ShaderMaterial
	uniforms: Record<string, Uniform>
	image: HTMLImageElement
	mesh: Mesh<PlaneGeometry, ShaderMaterial>
	viewport: any
	animation: { x: number; y: number; py: number }
	index: number

	constructor(element: HTMLElement, viewport: any, index: number) {
		this.element = element
		this.viewport = viewport
		this.index = index
		this.animation = { x: 1.0, y: 0, py: 1.0 }

		// Set element to be invisible
		this.element.classList.add('gl-image')
		const img = element.querySelector('img') as HTMLImageElement
		const src = img.src

		this.image = img
		const texture = useTexture(src)

		// Uniforms
		this.uniforms = {
			uProgress: new Uniform(0),
			uTexture: new Uniform(texture),
			uResolution: new Uniform(
				new Vector2(window.innerWidth, window.innerHeight)
			),
			uPlaneSizes: new Uniform(new Vector2(1, 1)),
			uImagePosition: new Uniform(new Vector2(0, 0)),
		}

		const geometry = new PlaneGeometry(1, 1, 64, 64)
		this.material = new ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader,
			fragmentShader,
			defines: {
				PI: Math.PI,
			},
		})

		this.mesh = new Mesh(geometry, this.material)

		// Scaling
		this.size(window.innerWidth, window.innerHeight)

		const { subscribe } = useProgress()

		subscribe(({ ready }) => {
			if (ready) {
				this.animateIn()
			}
		})
	}

	animateIn() {
		animate(0, 1, {
			onUpdate: latest => {
				this.animation.y = latest
			},
			duration: 1,
			delay: 0.3 + this.index * 0.1,
			ease: easeOutExpo,
		})
	}

	cover() {
		const [px, py] = fit(this.image, this.mesh)
		this.uniforms.uPlaneSizes.value.set(px, py)
	}

	size(screenX: number, screenY: number) {
		const offsetWidth = this.element.offsetWidth
		const offsetHeight = this.element.offsetHeight
		const y = this.element.offsetTop
		const x = this.element.offsetLeft

		const scaleX = (this.viewport.current.width * offsetWidth) / screenX
		const scaleY = (this.viewport.current.height * offsetHeight) / screenY

		this.mesh.scale.set(scaleX * this.animation.x, scaleY * this.animation.y, 1)

		this.mesh.position.x =
			-(this.viewport.current.width / 2) +
			this.mesh.scale.x / 2 +
			(x / screenX) * this.viewport.current.width

		this.mesh.position.y =
			this.viewport.current.height / 2 -
			this.mesh.scale.y / 2 -
			((y - window.Lenis.scroll) / screenY) * this.viewport.current.height

		this.mesh.position.y *= this.animation.py

		this.cover()
	}

	update(x: number, y: number) {
		this.size(x, y)
	}

	render() {}
}
