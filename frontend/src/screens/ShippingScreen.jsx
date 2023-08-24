import { useState } from "react"
import {Form, Button} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {saveShippingAddress} from '../slices/cartSlice';
import CheckoutSteps from "../components/CheckoutSteps"
import { Link } from 'react-router-dom'


const ShippingScreen = () => {

    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;

    const {userInfo} = useSelector(state => state.auth);


    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [phone, setPhone] = useState(shippingAddress?.phone || '');
    const [country, setCountry] = useState(shippingAddress?.country || 'Việt Nam');


    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({address, city, phone, country}));
        navigate('/payment')
    }


    return (
        <>
            <Link className="btn btn-light my-3" to="/cart">
                Quay lại
            </Link>
            <FormContainer>
                <CheckoutSteps step1 step2 />
                <h1>Giao hàng</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='address' className='my-2'>
                        <Form.Label style={{fontSize: '20px'}}>Địa chỉ</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Nhập địa chỉ'
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='city' className='my-2'>
                        <Form.Label style={{fontSize: '20px'}}>Thành phố</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Nhập tên thành phố'
                            value={city}
                            onChange={e => setCity(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='phone' className='my-2'>
                        <Form.Label style={{fontSize: '20px'}}> Số điện thoại </Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Nhập số điện thoại'
                            value={phone}
                            defaultValue={userInfo.phone}
                            onChange={e => setPhone(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='country' className='my-2'>
                        <Form.Label style={{fontSize: '20px'}}>Địa chỉ</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Nhập tên nước'
                            value={country}
                            onChange={e => setCountry(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Button 
                        type='submit'
                        variant='primary'
                        className='my-2'
                    >Tiếp tục</Button>
                </Form>
            </FormContainer>
        </>
        
    )
}

export default ShippingScreen