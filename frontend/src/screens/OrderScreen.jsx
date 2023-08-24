import { Link, useParams } from 'react-router-dom';
import {Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useGetOrderDetailsQuery, useDeliverOrderMutation, usePayOrderMutation } from '../slices/ordersApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { handleNumber, handlePhoneNumber } from '../utils/handlerNumber';

const OrderScreen = () => {

    const { id: orderId } = useParams();

    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

    const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();
    const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation();


    const { userInfo } = useSelector(state => state.auth);

    const deliverOrderHandler = async () => {
        try{
            if(window.confirm('Bạn có muốn đánh dấu đơn hàng này đã vận chuyển xong?')){
                await deliverOrder(orderId);
                refetch();
                toast.success('Đã vận chuyển thành công')
            }
        } catch(e){
            toast.error(e?.data?.message || e.message)
        }
    }

    const payOrderHandler = async() => {
        try{
            if(window.confirm('Bạn có muốn đánh dấu đơn hàng này đã thanh toán xong?')){
                await payOrder(orderId);
                refetch();
                toast.success('Đã thanh toán thành công')
            }
        } catch(e){
            toast.error(e?.data?.message || e.message)
        }
    }

  return isLoading ? (<Loader /> ) : error ? <Message variant="danger">{error?.data?.message || error.error}</Message> : (
    <>
        <Link className="btn btn-light my-3" to="/">
            Quay lại
        </Link>
        <h1>Mã đơn hàng {order._id}</h1>
        <p>Nếu quý khách muốn chuyển khoản trực tiếp thì chúng tôi sẽ gửi thông tin chuyển khoản cho quý khách</p>
        <p>Ngân hàng: Viettinbank</p>
        <p>STK: 100869751883</p>
        <p>Họ tên chủ TK: NGUYEN DINH KHANG</p>
        <p style={{color: 'red'}}>Nhập nội dung*: Họ tên + {order._id}</p>
        <p>Vui lòng gửi hóa đơn đã chuyển khoản về zalo <b>0368719029</b> để xử lí nếu gặp sự cố</p>
        <Row>
            <Col md={8}>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h2>Giao hàng</h2>
                        <p>
                            <strong>Tên khách hàng: </strong> { order.user.name }
                        </p>
                        <p>
                            <strong>Email: </strong> { order.user.email }
                        </p>
                        <p>
                            <strong>Địa chỉ: </strong> { order.shippingAddress.address }, {order.shippingAddress.city}, {order.shippingAddress.country}
                        </p>
                        <p>
                            <strong>SĐT: </strong> { order.shippingAddress.phone && handlePhoneNumber(order.shippingAddress.phone)}
                        </p>
                        {order.isDelivered ? (
                            <Message variant="success">Đơn hàng đã giao đi vào lúc {order.deliveredAt.substring(0, 10)}</Message>
                        ) : (
                            <Message variant="danger">Chưa được giao đi</Message>
                        )}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Phương thức thanh toán</h2>
                        <p>
                            <strong>Phương thức: </strong>
                            {order.paymentMethod==="cash" && "Tiền mặt"}
                        </p>
                        {order.isPaid ? (
                            <Message variant="success">Đơn hàng đã thanh toán {order.paidAt.substring(0, 10)}</Message>
                        ) : (
                            <Message variant="danger">Chưa được thanh toán</Message>
                        )}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Sản phẩm trong đơn hàng</h2>
                        {order.orderItems.map((item, index) => (
                            <ListGroup.Item key={index}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name.substring(0,10)} fluid rounded />
                                    </Col>
                                    <Col>
                                        <Link to={`/product/${item.product}`}>
                                            {item.name}
                                        </Link>
                                    </Col>
                                    <Col md={5}>
                                        {item.qty} x {item.price && handleNumber(item.price)} VND = {(item.qty*item.price) && handleNumber(item.qty*item.price)} VND
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
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
                                <Col>Sản phẩm</Col>
                                <Col>{order.itemsPrice && handleNumber(order.itemsPrice)} VND</Col>
                            </Row>
                            <Row>
                                <Col>Phí giao hàng</Col>
                                <Col>{order.shippingPrice && handleNumber(order.shippingPrice)} VND</Col>
                            </Row>
                            <Row>
                                <Col>Phí thuế</Col>
                                <Col>{order.taxPrice && handleNumber(order.taxPrice)} VND</Col>
                            </Row>
                            <Row>
                                <Col>Tổng tiền</Col>
                                <Col><strong>{order.totalPrice && handleNumber(order.totalPrice)} VND</strong></Col>
                            </Row>
                        </ListGroup.Item>
                        {loadingDeliver && <Loader />}
                        {userInfo && userInfo.isAdmin && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button 
                                    type='button'
                                    className='btn btn-block'
                                    onClick={deliverOrderHandler}
                                >Đánh dấu đã vận chuyển</Button>
                            </ListGroup.Item>
                        )}
                        {loadingPay && <Loader />}
                        {userInfo && userInfo.isAdmin && !order.isPaid && (
                            <ListGroup.Item>
                                <Button 
                                    type='button'       
                                    className='btn btn-block'
                                    onClick={payOrderHandler}
                                >Đánh dấu đã thanh toán</Button>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>
            </Col>

        </Row>
    </>
  )
}

export default OrderScreen