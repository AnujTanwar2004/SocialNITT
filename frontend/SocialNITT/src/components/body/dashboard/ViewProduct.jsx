import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts } from '../../../redux/slices/productSlice'

function ViewProduct() {
  const { id } = useParams()
  const dispatch = useDispatch()

  const products = useSelector(state => state.products.items)
  const status = useSelector(state => state.products.status)

  // ✅ Fetch products on component mount if not already fetched
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts())
    }
  }, [dispatch, status])

  const product = products.find(p => p._id === id)

  if (!product) return <h2 style={{ textAlign: 'center', margin: '50px 0' }}>Product not found.</h2>

  return (
    <section className="cta-secondary">
      <div className="cta-cover"></div>
      <div className="cta-container">
        <div className="cta-details">
          <h3>{product.title}</h3>
          <div className="first">
            <p>₹ {product.price}</p>
            <p><i className="fa fa-map-marker" title="location"></i> {product.location}</p>
          </div>
          <div className="second">
            <p>Category: {product.category}</p>
            <p><i className="fa fa-calendar" title="Posted at"></i> {product.updatedAt.slice(0, 10)}</p>
          </div>
          <p>{product.description}</p>
          <a
            className="cta-btn"
            href={`https://wa.me/${product.phone}`}
            target="_blank"
            rel="noreferrer"
          >
            Contact
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
        <div className="cta-image">
          <img src={product.image} alt={product.title} />
        </div>
      </div>
    </section>
  )
}

export default ViewProduct
