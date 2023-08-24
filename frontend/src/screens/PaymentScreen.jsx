import {useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import {Form, Button, Col} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../slices/cartSlice'

const PaymentScreen = () => {

    const [paymentMethod, setPaymentMethod] = useState('cash')

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if(!shippingAddress) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate])

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        
        navigate('/placeorder');
    }

    return (
        <>
            <Link className="btn btn-light my-3" to="/shipping">
                Quay lại
            </Link>
            <FormContainer>
                <CheckoutSteps step1 step2 step3 />
                <h1>Phương thức thanh toán</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group>
                        <Form.Label as='legend'>Phương thức thanh toán</Form.Label>
                        <Col>
                            <Form.Check
                                type='radio'
                                className='my-2'
                                label={'Tiền mặt hoặc chuyển khoản trực tiếp'}
                                id='cash'
                                name='paymentMethod'
                                value='cash'
                                checked
                                onChange= {e => setPaymentMethod(e.target.value)}
                            >
                            </Form.Check>
                        </Col>
                    </Form.Group>
                    <Button type="submit" variant="primary">Tiếp tục</Button>
                </Form>
            </FormContainer>    
        </>
    
  )
}

export default PaymentScreen