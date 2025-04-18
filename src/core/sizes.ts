import { create } from '../helpers/create'

export const useSize = create(() => ({
	width: window.innerWidth,
	height: window.innerHeight,
}))

window.addEventListener('resize', () => {
	useSize.setState({ width: window.innerWidth, height: window.innerHeight })
})
