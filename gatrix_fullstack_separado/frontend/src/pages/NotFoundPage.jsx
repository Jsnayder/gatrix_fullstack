import { Link } from 'react-router-dom'
export default function NotFoundPage(){return <div style={{minHeight:'100vh',display:'grid',placeItems:'center',textAlign:'center',fontFamily:'system-ui'}}><div><h1>404</h1><p>La página solicitada no existe.</p><Link to="/">Volver al inicio</Link></div></div>}
