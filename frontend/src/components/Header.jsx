import {Navbar, Nav, Container, Badge, NavDropdown} from 'react-bootstrap'
import {FaShoppingCart, FaUser} from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'
import logo from '../assets/logo.png'   
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import SearchBox from './SearchBox'
import {resetCart} from '../slices/cartSlice';

const Header = () => {

    const { cartItems } = useSelector((state) => state.cart)
    const { userInfo } = useSelector((state) => state.auth)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout())
            dispatch(resetCart());
            navigate('/login')
        } catch (err) {
            console.log(err)
        }
    }

  return (
    <header>
        <Navbar bg="primary" variant='dark' expand="lg" collapseOnSelect>
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>
                        <img src={logo} alt="Mỹ phẩm K&K" />
                        Mỹ phẩm K&K
                    </Navbar.Brand>
                </LinkContainer>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <SearchBox />
                        <LinkContainer to="/cart">
                            <Nav.Link>
                                <FaShoppingCart />Giỏ hàng
                                {
                                    cartItems.length > 0 && (
                                        <Badge pill bg='success' style={{marginLeft: '5px'}}>
                                            {cartItems.reduce((a,c) => a + c.qty, 0)}
                                        </Badge>
                                    )

                                }
                            </Nav.Link>
                        </LinkContainer>
                        { userInfo ? (
                            <NavDropdown title={userInfo.name} id='username'>
                                <LinkContainer to='/profile'>
                                    <NavDropdown.Item>Thông tin</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item onClick={logoutHandler}>
                                    Đăng xuất
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <LinkContainer to="/login">
                                <Nav.Link>
                                    <FaUser />Đăng nhập
                                </Nav.Link>
                            </LinkContainer>
                        )}
                        {userInfo && userInfo.isAdmin && (
                            <NavDropdown title="Admin" id="adminmenu">
                                <LinkContainer to="/admin/orderlist">
                                    <NavDropdown.Item>
                                        Đơn hàng
                                    </NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/admin/productlist">
                                    <NavDropdown.Item>
                                        Sản phẩm
                                    </NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/admin/userlist">
                                    <NavDropdown.Item>
                                        Người dùng
                                    </NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>   
  )
}

export default Header