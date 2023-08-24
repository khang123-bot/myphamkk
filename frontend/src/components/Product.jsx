import {Card} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import Rating from './Rating'
import { handleNumber } from '../utils/handlerNumber'

const Product = ({product}) => {

    console.log('home',product);

  return (
    <Card className="my-3 p-3 rounded">
        <Link to={`/product/${product._id}`}>
            <Card.Img src={`../${product.image}`} variant="top" className='cardImage'/>
        </Link>

        <Card.Body>
            <Link to={`/products/${product._id}`}>
                <Card.Title as="div" className='product-title'>
                    <strong>{product.name}</strong>
                </Card.Title>
            </Link>

            <Card.Text as="div">
                <Rating value={product.rating} text={`${product.numReviews} nhận xét`} />
            </Card.Text>

            <Card.Text as="h3">
                {product.price && handleNumber(product.price)} VND
            </Card.Text>
        </Card.Body>
    </Card>
  )
}

export default Product