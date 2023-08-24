import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from "../components/FormContainer";
import Loader from '../components/Loader';
import { useRegisterMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { checkPassword, checkPhoneNumber } from '../validator/validator'

const RegisterScreen = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, {isLoading}] = useRegisterMutation();
    const { userInfo } = useSelector(state => state.auth);

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if(userInfo) {
            navigate(redirect)
        }
    }, [userInfo, redirect, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (checkPassword(password) !== "") {
            toast.error(checkPassword(password))
        } else if(password !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không đúng!')
        } else if(!checkPhoneNumber(phone)){
            toast.error('Vui lòng nhập lại SĐT!')
        }
        else {
            try {
                const res = await register({name, email, password, phone}).unwrap();
                dispatch(setCredentials({...res}));
                toast.success('Tài khoản đã tạo thành công')
                navigate(redirect);
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    }

    return (
        <FormContainer>
            <h1>Đăng kí</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className="my-3">
                    <Form.Label style={{fontSize: '20px'}}>
                        Tên người dùng
                    </Form.Label>
                    <Form.Control 
                        type='name'
                        placeholder="Nhập tên người dùng..."
                        value={name}
                        onChange={e => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='email' className="my-3">
                    <Form.Label style={{fontSize: '20px'}}>
                        Tên đăng nhập
                    </Form.Label>
                    <Form.Control 
                        type='text'
                        placeholder="Nhập tên đăng nhập..."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='password' className="my-3">
                    <Form.Label style={{fontSize: '20px'}}>
                        Mật khẩu
                    </Form.Label>
                    <Form.Control 
                        type='password'
                        placeholder="Nhập mật khẩu..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    ></Form.Control>
                    <p style={{color: 'gray'}}>
                        * Mật khẩu phải chứa ít nhất 6 kí tự trong đó có 1 chữ cái thường, 1 chữ cái in hoa và 1 số
                    </p>
                </Form.Group>
                <Form.Group controlId='confirmPassword' className="my-3">
                    <Form.Label style={{fontSize: '20px'}}>
                        Nhập lại mật khẩu
                    </Form.Label>
                    <Form.Control 
                        type='password'
                        placeholder="Nhập mật khẩu vừa tạo..."
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='phone' className="my-3">
                    <Form.Label style={{fontSize: '20px'}}>
                        Nhập SĐT
                    </Form.Label>
                    <Form.Control 
                        type='text'
                        placeholder="Nhập SĐT..."
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Button
                    type='submit'
                    variant='primary'
                    className="mt-2"
                    disabled={ isLoading }
                >
                    Đăng kí
                </Button>
                { isLoading && <Loader /> }
            </Form>

            <Row className="py-3">
                <Col>
                    Đã có tài khoản? {' '} <Link to={ redirect ? `/login?redirect=${redirect}`: '/login'}>Đăng nhập</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen