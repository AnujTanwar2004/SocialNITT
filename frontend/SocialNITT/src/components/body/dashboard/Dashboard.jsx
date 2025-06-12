import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts } from "../../../redux/slices/productSlice"

import dashImage from '../../assets/dashboard.png'

function Dashboard() {
  const dispatch = useDispatch()

  const auth = useSelector(state => state.auth)
  const { isLogged } = auth

  const products = useSelector(state => state.products.items) // this should match your slice state
  const status = useSelector(state => state.products.status)

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (isLogged && status === 'idle') {
      dispatch(fetchProducts())  // ✅ No need to pass token now
    }
  }, [isLogged, dispatch, status])

  return (
    <>
      <section>
        <div className="cta-primary">
          <div className="cta-container">
            <div className="cta-details">
              <h3>
              🌿 Discover. Connect. Trade. <span></span>
              </h3>
             <span>Buy and sell with your fellow students at NIT Trichy. Whether it's books, cycles, gadgets, or furniture , find everything you need within your campus community.</span>
            </div>
            <div className="cta-btn">
              <p><Link to="/create_product">List Product</Link></p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
          <div className="cta-image">
            <img src={dashImage} alt="dashboard" />
          </div>
        </div>
      </section>

      <section className="cards-primary">
        <div className="cards-header">
          <h1>Products</h1>
          <p>Products listed by users all over the world.</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="search-form-primary">
          <div className="search-form-container">
            <svg xmlns="http://www.w3.org/2000/svg" className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              onChange={(event) => {
                setSearchTerm(event.target.value)
              }}
            />
          </div>
        </form>

        <div className="card-container">
          {products && products
            .filter((item) => {
              if (searchTerm === "") return true
              return item.title.toLowerCase().includes(searchTerm.toLowerCase())
            })
            .map((item, key) =>
              !item.isArchived ? (
                <article className="card" key={key}>
                  <p className="card-details">
                    <Link to={`/view_product/${item._id}`}>
                      <img src={item.image} loading="lazy" alt={item.title} className="w-full h-48 rounded-tl-md rounded-tr-md" />
                      <div className="card-header">
                        <div className="info">
                          <span className="cost">₹ {item.price}</span>
                          <span className="date">{item.updatedAt.slice(0, 10)}</span>
                        </div>
                      </div>
                      <div className="card-footer">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </Link>
                  </p>
                </article>
              ) : null
            )}
        </div>
      </section>
    </>
  )
}

export default Dashboard
