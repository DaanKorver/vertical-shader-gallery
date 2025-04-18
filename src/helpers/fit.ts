import { Mesh } from 'three'

export function fit(image: HTMLImageElement, mesh: Mesh) {
	const imageRatio = image.naturalWidth / image.naturalHeight
	const meshSizesAspect = mesh.scale.x / mesh.scale.y

	let scaleWidth, scaleHeight

	if (imageRatio > meshSizesAspect) {
		scaleWidth = imageRatio / meshSizesAspect
		scaleHeight = 1
	} else if (imageRatio < meshSizesAspect) {
		scaleWidth = 1
		scaleHeight = meshSizesAspect / imageRatio
	} else {
		scaleWidth = 1
		scaleHeight = 1
	}

	return [scaleWidth, scaleHeight]
}
