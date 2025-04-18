type Creator<T> = () => T
type Subscriber<T> = (state: T) => void

export function create<T>(creator: Creator<T>) {
	let _state = creator()
	const subscribers = new Map<Function, Function>()

	return Object.freeze({
		get current(): T {
			return _state
		},

		setState(newState: T | Partial<T>) {
			if (typeof newState === 'object') {
				_state = { ...this.current, ...newState }
			} else {
				_state = newState
			}
			subscribers.forEach(subscriber => {
				subscriber(_state)
			})
		},

		subscribe(subscriber: Subscriber<T>) {
			subscribers.set(subscriber, subscriber)
			return () => {
				subscribers.delete(subscriber)
			}
		},
	})
}
