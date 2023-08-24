import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import {Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'
import CheckoutSteps from '../components/CheckoutSteps'
import { toast } from 'react-toastify'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {useCreateOrderMutation} from '../slices/ordersApiSlice'
import {clearCartItems} from '../slices/cartSlice'
import { handleNumber } from '../utils/handlerNumber';


const PlaceOrderScreen = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart);

    const [createOrder, { isLoading, error}] = useCreateOrderMutation();
    useEffect(() => {
        if(!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if(!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate])

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();
            console.log(cart.cartItems[0].image);
            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (err) {
            toast.error(error)
        }
    }
    
  return (
    <>
        <Link className="btn btn-light my-3" to="/payment">
            Quay lại
        </Link>
        <CheckoutSteps step1 step2 step3 step4 />
        <Row>
            <Col md={8}>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h2>Giao hàng</h2>
                        <p>
                            <strong>Địa chỉ: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.country}
                            <br></br>
                            <strong>Thông tin liên hệ: </strong>
                            {cart.shippingAddress.phone}
                        </p>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Phương thức thanh toán</h2>
                        <strong>Phương thức: </strong>
                        {cart.paymentMethod==="cash" && 'Tiền mặt'}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Sản phẩm trong đơn hàng</h2>
                        {cart.cartItems.length === 0 ? (
                            <Message>Đơn hàng của bạn đang rỗng</Message>
                        ) : (
                            <ListGroup variant="flush">
                                {cart.cartItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <Row>
                                            <Col md={1}>
                                                <Image src={`../${item.image}`} alt={item.name} fluid rounded />
                                            </Col>
                                            <Col>
                                                <Link to={`/products/${item.product}`}>
                                                    {item.name}
                                                </Link>
                                            </Col>
                                            <Col md={5}>
                                                { item.qty } x {item.price && handleNumber(item.price)} VND = {(item.qty * item.price) && handleNumber((item.qty * item.price))} VND
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Tổng hợp đơn hàng</h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Sản phẩm:</Col>
                                <Col>
                                    {cart.itemsPrice && handleNumber(cart.itemsPrice)} VND
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Phí giao hàng:</Col>
                                <Col>
                                    {cart.shippingPrice && handleNumber(cart.shippingPrice)} VND
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Phí thuế:</Col>
                                <Col>
                                    {cart.taxPrice && handleNumber(cart.taxPrice)} VND
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Tổng tiền:</Col>
                                <Col>
                                    <strong>{cart.totalPrice && handleNumber(cart.totalPrice)} VNĐ</strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {error && <Message variant='danger'>{error.data.message}</Message>}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <div className="btn-center-div">
                                <Button 
                                    type='button'
                                    className='btn-block w-full'
                                    disabled={cart.cartItems.length === 0}
                                    onClick={ placeOrderHandler }
                                >
                                    Đặt hàng
                                </Button>
                            </div>
                            {isLoading && <Loader />}
                        </ListGroup.Item>

                    </ListGroup>        
                </Card>
            </Col>
        </Row>
    </>
  )
}

export default PlaceOrderScreen