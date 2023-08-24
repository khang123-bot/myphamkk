import {LinkContainer} from 'react-router-bootstrap'
import { FaEdit, FaTrash} from 'react-icons/fa'
import { Button, Table, Row, Col} from 'react-bootstrap'
import { useParams , useNavigate } from 'react-router-dom';
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {useGetProductsQuery, useDeleteProductMutation} from '../../slices/productsApiSlice'
import {toast} from 'react-toastify';
import Paginate from '../../components/Paginate';
import { handleNumber } from '../../utils/handlerNumber';

const ProductListScreen = () => {

    const {pageNumber} = useParams();
    const navigate = useNavigate();

    const {data, isLoading, error, refetch} = useGetProductsQuery({pageNumber});
    const [deleteProduct, {isLoading: loadingDelete}] = useDeleteProductMutation();


    const deleteHandler = async (id) => {
        if(window.confirm('Bạn muốn xóa sản phẩm này chứ?')){
            try{
                await deleteProduct(id);
                refetch();
                toast('Sản phẩm đã được xóa thành công');
            } catch(err){
                toast.error(err?.data?.message || err.error);
            }
        }
    }

    const createProductHandler = async () => {
        if(window.confirm('Bạn có muốn tạo sản phẩm mới không?')) {
            try {
                navigate('/admin/createproduct')
            } catch (err) {   
                toast.error(err?.data?.message || err.error)
            }
        }
    }
  return (
    <>
        <Row className="align-items-center">
            <Col>
                <h1>Danh sách sản phẩm</h1>

            </Col>
            <Col className="text-end">
                <Button className="btn-sm m-3" onClick={createProductHandler}>
                    <FaEdit /> Thêm sản phẩm mới
                </Button>
            </Col>
        </Row>
        {loadingDelete && <Loader />}
        {isLoading ? <Loader /> : error ? <Message variant="danger">{error.data.message}</Message> : (
            <>
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>Mã sản phẩm</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá tiền (VND)</th>
                            <th>Danh sách</th>
                            <th>Thương hiệu</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.products.map(product =>(
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price && handleNumber(product.price)}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                        <Button variant='light' className='btn-sm mx-2'>
                                            <FaEdit />
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm'
                                            onClick={() => deleteHandler(product._id)}
                                    >
                                        <FaTrash style={{color: 'white'}}/>
                                    </Button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Paginate pages={data.pages} page={data.page} isAdmin={true} />
            </>
        )}
    </>
  )
}

export default ProductListScreen