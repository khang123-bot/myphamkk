import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import {Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../slices/productsApiSlice";
import {addToCart} from '../slices/cartSlice';
import {toast} from 'react-toastify';
import Meta from '../components/Meta';
import { handleNumber } from "../utils/handlerNumber";

const ProductScreen = () => {
    const { id:productId } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('')

    const {data: product, isLoading, refetch, error} = useGetProductDetailsQuery(productId);

    const [createReview, {isLoading: loadingProductReview}] = useCreateReviewMutation();

    const {userInfo} = useSelector(state => state.auth);

    const addToCartHandler =  () => {
        
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart');
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await createReview({
                productId, rating, comment
            }).unwrap();
            refetch();
            toast.success('Đánh giá sản phẩm đã được ghi nhận');
            setRating(0);
            setComment('')
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

  return (
    <>
        <Link className="btn btn-light my-3" to="/">
            Quay lại
        </Link>

        {isLoading ? (
            <Loader />
        ) : error ? (
            <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
            <>
                <Meta title={product.name} />
                <Row>
                    <Col md={5}>
                        <Image src={`../${product.image}`} alt={product.name} fluid className="cardImage"/>
                    </Col>
                    <Col md={4}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>{product.name}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating value={product.rating} text={`${product.numReviews} nhận xét`} />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Giá tiền:</strong> {product.price && handleNumber(product.price)} VND
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Giới thiệu:</strong> {product.description}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Giá tiền:</Col>
                                        <Col><strong>{product.price && handleNumber(product.price)} VND</strong></Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Trạng thái:</Col>
                                        <Col><strong>{product.countInStock > 0 ? 'Còn hàng' : 'Hết hàng'}</strong></Col>
                                    </Row>
                                </ListGroup.Item>

                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Số lượng: </Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    value={qty}
                                                    onChange={ (e) => setQty(Number(e.target.value)) 
                                                    }>
                                                        {[...Array(product.countInStock).keys()].map(x => (
                                                            <option key={x+1} value={x+1}>
                                                                { x + 1}
                                                            </option>
                                                        ))}
                                                </Form.Control>
                                            </Col>

                                        </Row>
                                    </ListGroup.Item>
                                )}

                                <ListGroup.Item>
                                    <div className="btn-center-div">
                                        <Button
                                            className="btn-block w-full"
                                            type="button"
                                            disabled={product.countInStock === 0}
                                            onClick={addToCartHandler}
                                        >
                                            Thêm vào giỏ hàng
                                        </Button>
                                    </div>
                                    
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
                <Row className="review">
                    <Col md={6}>
                        <h2>Đánh giá</h2>
                        {product.reviews.length === 0 && <Message>Không có đánh giá nào</Message>}
                        <ListGroup variant="flush">
                            {product.reviews.map(review => (
                                <ListGroup.Item key={review._id}>
                                    <strong>{review.name}</strong>
                                    <Rating value={review.rating} />
                                    <p>{review.createdAt.substring(0,10)}</p>
                                    <p>{review.comment}</p>
                                </ListGroup.Item>
                            ))}
                            <ListGroup.Item>
                                <h2>Hãy để lại một đánh giá về sản phẩm này</h2>
                                {loadingProductReview && <Loader />}
                                {userInfo ? (
                                    <Form onSubmit={submitHandler}>
                                        <Form.Group controlId='rating' className="my-2">
                                            <Form.Label>Đánh giá</Form.Label>
                                            <Form.Control
                                                as='select'
                                                value={rating}
                                                onChange={e => setRating(e.target.value)}
                                            >
                                                <option value=''>Lựa chọn...</option>
                                                <option value='1'>1 - Tệ</option>
                                                <option value='2'>2 - Không tốt</option>
                                                <option value='3'>3 - Ổn</option>
                                                <option value='4'>4 - Tốt</option>
                                                <option value='5'>5 - Tuyệt vời</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId='comment' className="my-2">
                                            <Form.Label>Bình luận</Form.Label>
                                            <Form.Control
                                                as='textarea'
                                                row='3'
                                                value={comment}
                                                onChange={e => setComment(e.target.value)}
                                            >
                                            </Form.Control>
                                        </Form.Group>
                                        <Button
                                            disabled={loadingProductReview}
                                            type='submit'
                                            variant="primary"
                                        >
                                            Gửi đánh giá
                                        </Button>

                                    </Form>
                                ) : (
                                    <Message>
                                        Vui lòng <Link to='/login'>đăng nhập</Link> để viết đánh giá về sản phẩm{' '}
                                    </Message>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </>
        )}  
    </>
  )
}

export default ProductScreen