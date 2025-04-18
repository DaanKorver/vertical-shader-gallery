import { LoadingManager, TextureLoader } from 'three'
import { create } from '../helpers/create'

const store = create(() => ({
	progress: 0,
	ready: false,
}))

const manager = new LoadingManager(undefined, (url, loaded, total) => {
	const progress = loaded / total

	store.setState({ progress })
})
const loader = new TextureLoader(manager)

export function useProgress() {
	return store
}

export function useTexture(src: string) {
	const texture = loader.load(src)
	return texture
}
