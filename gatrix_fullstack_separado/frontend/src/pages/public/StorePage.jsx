import { useEffect, useState } from 'react'
import { Search, ShoppingCart, SlidersHorizontal, Trash2 } from 'lucide-react'
import { api } from '../../services/api'
import { useDebounce } from '../../hooks/useDebounce'
import { useCart } from '../../context/CartContext'
import LoadingState from '../../components/feedback/LoadingState'
import EmptyState from '../../components/feedback/EmptyState'
import styles from './StorePage.module.css'

const fallbackImage = '/img/Imagen09.png'

export default function StorePage(){
  const [search,setSearch]=useState('')
  const [category,setCategory]=useState('')
  const [page,setPage]=useState(1)
  const [data,setData]=useState({items:[],categories:[],total:0,pages:1})
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')
  const debounced=useDebounce(search,350)
  const cart=useCart()

  useEffect(()=>{
    let live=true
    setLoading(true)
    setError('')
    const params=new URLSearchParams({page:String(page),pageSize:'8'})
    if(debounced)params.set('q',debounced)
    if(category)params.set('category',category)
    api(`/api/public/products?${params}`)
      .then(r=>live&&setData(r))
      .catch(e=>live&&setError(e.message))
      .finally(()=>live&&setLoading(false))
    return()=>{live=false}
  },[debounced,category,page])

  const hasItems=data.items?.length>0
  return <>
    <section className={styles.banner}><span><ShoppingCart size={20}/> Productos para tu auto como todo un profesional</span><p>Encuentra productos seleccionados para el cuidado y mantenimiento de tu vehículo.</p></section>
    <section className={styles.shop}>
      <div className={styles.catalog}>
        <div className={styles.toolbar}>
          <label><Search size={18}/><input value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Buscar producto..."/></label>
          <label><SlidersHorizontal size={17}/><select value={category} onChange={e=>{setCategory(e.target.value);setPage(1)}}><option value="">Todas las categorías</option>{data.categories?.map(c=><option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}</select></label>
        </div>
        {loading?<LoadingState label="Cargando catálogo..."/>:error?<div className={styles.error}>{error}</div>:!hasItems?<EmptyState title="Aún no hay productos disponibles" description="Pronto encontrarás aquí productos para el cuidado de tu vehículo."/>:<>
          <div className={styles.grid}>{data.items.map(p=><article className={styles.card} key={p.id_producto}>
            <div className={styles.imageWrap}><img src={p.imagen_url || fallbackImage} alt={p.imagen_url ? `Imagen de ${p.descripcion}` : `Imagen referencial de ${p.descripcion}`} loading="lazy"/><span>{p.categoria||'Producto'}</span></div>
            <div className={styles.cardBody}><h3>{p.descripcion}</h3><p>Código: {p.codigo}</p><div className={styles.stock}>{p.stock_actual>0?`${p.stock_actual} disponibles`:'Sin stock'}</div><div className={styles.cardFoot}><strong>S/ {Number(p.precio_unitario).toFixed(2)}</strong><button onClick={()=>cart.add(p)} disabled={p.stock_actual<=0}>Agregar</button></div></div>
          </article>)}</div>
          <div className={styles.pagination}><button disabled={page<=1} onClick={()=>setPage(v=>v-1)}>Anterior</button><span>Página {page} de {data.pages}</span><button disabled={page>=data.pages} onClick={()=>setPage(v=>v+1)}>Siguiente</button></div>
        </>}
      </div>
      <aside className={styles.cartPanel}><div className={styles.cartTitle}><ShoppingCart/><div><b>Carrito</b><small>{cart.count} producto(s)</small></div></div>{!cart.items.length?<p className={styles.cartEmpty}>Tu carrito está vacío.</p>:<div className={styles.cartItems}>{cart.items.map(i=><div key={i.id_producto}><span>{i.quantity}× {i.descripcion}</span><button onClick={()=>cart.remove(i.id_producto)} aria-label="Quitar"><Trash2 size={16}/></button></div>)}</div>}<div className={styles.total}><span>Total referencial</span><b>S/ {cart.total.toFixed(2)}</b></div><p className={styles.disclaimer}>Las imágenes son referenciales. Disponibilidad y precio pueden variar según el stock vigente.</p></aside>
    </section>
  </>
}
