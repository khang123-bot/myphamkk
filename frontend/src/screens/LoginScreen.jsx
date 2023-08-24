import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from "../components/FormContainer";
import Loader from '../components/Loader';
import { useLoginMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { checkEmail } from '../validator/validator'


const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, {isLoading}] = useLoginMutation();
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
        if(!checkEmail(email)){
            toast.error('Vui lòng nhập đúng định dạng địa chỉ email!')
        } else {
            try {
                const res = await login({email, password}).unwrap();
                dispatch(setCredentials({...res}));
                toast.success('Đăng nhập thành công')
                navigate(redirect);
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    }

    return (
        <FormContainer>
            <h1>Đăng nhập</h1>
            <Form onSubmit={submitHandler}>
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
                </Form.Group>

                <Button
                    type='submit'
                    variant='primary'
                    className="mt-2"
                    disabled={ isLoading }
                >
                    Đăng nhập
                </Button>
                { isLoading && <Loader /> }
            </Form>

            <Row className="py-3">
                <Col>
                    Khách hàng mới? <Link to={ redirect ? `/register?redirect=${redirect}`: '/register'}>Đăng kí</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen