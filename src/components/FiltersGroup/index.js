import './index.css'

const FiltersGroup = props => {
  const {catDetails, onChangeCategory, activeCategoryId} = props
  const {categoryId, name} = catDetails
  const onTakeCat = () => {
    onChangeCategory(categoryId)
  }
  return (
    <li>
      <p
        onClick={onTakeCat}
        className={activeCategoryId === categoryId ? `clr-btn btn` : 'btn'}
      >
        {name}
      </p>
    </li>
  )
}
export default FiltersGroup
