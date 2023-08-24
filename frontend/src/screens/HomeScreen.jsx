import { Row, Col} from 'react-bootstrap'
import Product from '../components/Product'
import { useParams } from 'react-router-dom'
import { useGetProductsQuery } from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import { Link } from 'react-router-dom'
import ProductCarousel from '../components/ProductCarousel'

const HomeScreen = () => {

  const { pageNumber, keyword } = useParams();


//   const categories = [
//     { value: '', label: ''},
//     { value: 'Phone', label: 'Điện thoại'},
//     { value: 'Headphone', label: 'Tai nghe'},
//     { value: 'Lipstick', label: 'Son'}
// ]

  const {data, isLoading, error} = useGetProductsQuery({keyword, pageNumber});

  return (
    <>
        {!keyword ? <ProductCarousel /> : (<Link to='/' className='btn btn-light mb-4'>Quay về</Link>)}
        { isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            <h1>Sản phẩm mới nhất</h1>
            {/* <Form.Select
              className='w-sm'
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map((category,i) => (
                <option key={i} value={category.value}>{category.label}</option>
              ))}
            </Form.Select> */}
            <Row>
                { data.products.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
            <Paginate
                pages={data.pages}
                page={data.page}
                keyword = {keyword ? keyword : ''}
            />
          </>
        )}
    </>
  )
}

export default HomeScreen