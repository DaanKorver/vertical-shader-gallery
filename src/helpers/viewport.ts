import { PerspectiveCamera } from 'three'

export function getCurrentViewport(camera: PerspectiveCamera) {
	const current = {
		width: 0,
		height: 0,
	}

	const update = () => {
		const fov = camera.fov * (Math.PI / 180)
		const height = 2 * Math.tan(fov / 2) * camera.position.z
		const width = height * camera.aspect

		current.width = width
		current.height = height
	}

	update()

	return {
		update,
		current,
	}
}
