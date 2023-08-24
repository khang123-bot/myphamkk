import { Button, Form} from 'react-bootstrap'
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {useUpdateProductMutation, useGetProductDetailsQuery, useUploadProductImageMutation} from '../../slices/productsApiSlice'
import { useState, useEffect } from "react"
import {Link, useNavigate, useParams} from 'react-router-dom'
import FormContainer from '../../components/FormContainer';
import {toast} from 'react-toastify'

const ProductEditScreen = () => {

    const {id: productId} = useParams();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const {data:product, isLoading, refetch, error} = useGetProductDetailsQuery(productId);
    const [updateProduct, {isLoading: loadingUpdate}] = useUpdateProductMutation();
    const [uploadProductImage, {isLoading: loadingUpload}] = useUploadProductImageMutation();

    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault(); 
        try {
            await updateProduct({
                _id: productId,
                name,
                price,
                image,
                brand,
                category,
                description,
                countInStock
            }).unwrap();
            toast.success('Cật nhật sản phẩm thành công');
            refetch();
            navigate('/admin/productlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }

    useEffect(() => {
        if(product) {
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
        }
    }, [product])

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

  return (
    <>
        <Link to='/admin/productlist' className='btn btn-light my-3'>
            Quay về    
        </Link>
        <FormContainer>
            <h1>Cập nhật sản phẩm</h1>
            {loadingUpdate && <Loader />}
            {isLoading ? <Loader /> : error ? <Message variant='danger'>{error.data.message}</Message> : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='my-2'>
                        <Form.Label>Tên sản phẩm</Form.Label>
                        <Form.Control 
                            type='text'
                            placeholder='Nhập tên sản phẩm'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='price' className='my-2'>
                        <Form.Label>Giá tiền</Form.Label>
                        <Form.Control 
                            type='number'
                            placeholder='Nhập giá tiền'
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='image' className='my-2'>
                        <Form.Label>Hình ảnh</Form.Label>
                        <Form.Control type='text' placeholder='Tải ảnh' value={image} onChange={e => setImage(e.target.value)}></Form.Control>
                        <Form.Control type='file' label='Chọn file' onChange={uploadFileHandler}></Form.Control>
                        {loadingUpload && <Loader />}
                    </Form.Group>
                    <Form.Group controlId='brand' className='my-2'>
                        <Form.Label>Thương hiệu</Form.Label>
                        <Form.Control 
                            type='text'
                            placeholder='Nhập tên thương hiệu'
                            value={brand}
                            onChange={e => setBrand(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='countInStock' className='my-2'>
                        <Form.Label>Số lượng tồn kho</Form.Label>
                        <Form.Control 
                            type='number'
                            placeholder='Nhập số lượng'
                            value={countInStock}
                            onChange={e => setCountInStock(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='category' className='my-2'>
                        <Form.Label>Danh sách sản phẩm</Form.Label>
                        <Form.Control 
                            type='text'
                            placeholder='Nhập danh sách'
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='description' className='my-2'>
                        <Form.Label>Giới thiệu sản phẩm</Form.Label>
                        <Form.Control 
                            type='text'
                            placeholder='Nhập mô tả'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Button 
                        type='submit'
                        variant='primary'
                        className='my-2'
                    >Cập nhật</Button>
                </Form>

            )}

        </FormContainer>   
    </>
  )
}

export default ProductEditScreen