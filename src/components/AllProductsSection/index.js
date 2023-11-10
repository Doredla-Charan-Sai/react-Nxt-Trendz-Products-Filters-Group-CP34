import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    activeCategoryId: '',
    searchInput: '',
    activeRatingId: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  changeCategory = uniqueId => {
    this.setState({activeCategoryId: uniqueId}, this.getProducts)
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    console.log(ratingsList, categoryOptions)

    const {
      activeOptionId,
      activeCategoryId,
      searchInput,
      activeRatingId,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?rating=${activeRatingId}&&title_search=${searchInput}&&sort_by=${activeOptionId}&&category=${activeCategoryId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response.ok)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstants.success,
        searchInput: '',
      })
    } else if (response.status === 401) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return (
      <>
        {productsList.length !== 0 && (
          <div className="all-products-container">
            <ProductsHeader
              activeOptionId={activeOptionId}
              sortbyOptions={sortbyOptions}
              changeSortby={this.changeSortby}
            />
            <ul className="products-list">
              {productsList.map(product => (
                <ProductCard productData={product} key={product.id} />
              ))}
            </ul>
          </div>
        )}
        {productsList.length === 0 && (
          <div className="no-products-cont">
            <img
              className="no-products"
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
              alt="no products"
            />
            <h1 className="not-found">No Products Found</h1>
            <p className="again">
              We could not find any products. Try other filters.
            </p>
          </div>
        )}
      </>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  getInput = event => {
    if (event.key === 'Enter' && event.target.value.length !== 0) {
      this.setState({searchInput: event.target.value}, this.getProducts)
    }
  }

  selectRate = event => {
    console.log(event.target.value)
    this.setState({activeRatingId: event.target.id}, this.getProducts)
  }

  // TODO: Add failure view
  renderFailureView = () => (
    <div className="failure">
      <img
        className="failure-view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1 className="oops">Oops! Something Went Wrong</h1>
      <p className="trouble">
        We are having some trouble in processing your request.
      </p>
      <p className="again">Please try again later.</p>
    </div>
  )

  onClearFilters = () => {
    this.setState(
      {
        activeCategoryId: '',
        searchInput: '',
        activeRatingId: '',
        activeOptionId: sortbyOptions[0].optionId,
      },
      this.getProducts,
    )
  }

  render() {
    const {apiStatus, activeCategoryId} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}

        <div className="filters-group-container">
          <div className="search-cont">
            <input
              type="search"
              className="search"
              placeholder="search"
              onKeyUp={this.getInput}
            />
            <BsSearch className="search-icon" />
          </div>
          <h1 className="category-btns">Category</h1>
          <ul className="catList">
            {categoryOptions.map(eachCat => (
              <FiltersGroup
                catDetails={eachCat}
                onChangeCategory={this.changeCategory}
                key={eachCat.categoryId}
                activeCategoryId={activeCategoryId}
              />
            ))}
          </ul>
          <h1 className="category-btns">Rating</h1>
          <ul className="catList">
            {ratingsList.map(eachRate => (
              <li key={eachRate.ratingId}>
                <button
                  type="button"
                  value={eachRate.ratingId}
                  className="rate-btn"
                >
                  <img
                    src={eachRate.imageUrl}
                    id={eachRate.ratingId}
                    onClick={this.selectRate}
                    alt={`rating ${eachRate.ratingId}`}
                    className="rate-img"
                  />{' '}
                  & up
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="clear-filters"
            onClick={this.onClearFilters}
          >
            Clear Filters
          </button>
        </div>

        {apiStatus === apiStatusConstants.inProgress && this.renderLoader()}
        {apiStatus === apiStatusConstants.success && this.renderProductsList()}
        {apiStatus === apiStatusConstants.failure && this.renderFailureView()}
      </div>
    )
  }
}

export default AllProductsSection
