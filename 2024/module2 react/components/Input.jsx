import { forwardRef } from "react"

export default forwardRef(({errors=[], placeholder}, ref) => {
	return <>
		<input style={{background: errors.length ? 'red' : ''}} ref={ref} placeholder={placeholder} /><br />
		{errors.map(err => err && <p key={err} style={{color: 'red'}}>{err}</p>)}
	</>
})