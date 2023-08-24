import {LinkContainer} from 'react-router-bootstrap'
import {FaTimes} from 'react-icons/fa'
import { Button, Table} from 'react-bootstrap'
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {useGetOrdersQuery} from '../../slices/ordersApiSlice'
import { handleNumber } from '../../utils/handlerNumber';


const OrderListScreen = () => {

  const {data: orders, isLoading, error} = useGetOrdersQuery();
  return (
    <>
      <h1>Quản lí đơn hàng</h1>
      {isLoading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Tên người đặt</th>
              <th>Ngày</th>
              <th>Tổng tiền (VND)</th>
              <th>Đã thanh toán</th>
              <th>Đã vận chuyển</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice && handleNumber(order.totalPrice)}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{color: 'red'}} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{color: 'red'}} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' className='btn-sm'>
                      Chi tiết
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default OrderListScreen