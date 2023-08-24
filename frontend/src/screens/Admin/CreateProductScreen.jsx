import { Button, Form} from 'react-bootstrap'
import Loader from "../../components/Loader";
import {useCreateProductMutation, useUploadProductImageMutation} from '../../slices/productsApiSlice'
import { useState } from "react"
import {Link, useNavigate} from 'react-router-dom'
import FormContainer from '../../components/FormContainer';
import {toast} from 'react-toastify';

const CreateProductScreen = () => {

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const options = [
        { value: '', label: ''},
        { value: 'Phone', label: 'Điện thoại'},
        { value: 'Headphone', label: 'Tai nghe'},
        { value: 'Lipstick', label: 'Son'}
    ]

    const [category, setCategory] = useState(null);


    const navigate = useNavigate();

    const [createProduct, {isLoading}] = useCreateProductMutation();
    const [uploadProductImage, {isLoading: loadingUpload}] = useUploadProductImageMutation();

    const submitHandler = async (e) => {
        e.preventDefault();
        try{
          const data = {
            name, price, image, brand, category, countInStock, description
          }
          if(data) {
              await createProduct(data).unwrap();
              navigate('/admin/productlist');
          }
        } catch(err){

        }
    }

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
            <h1>Tạo mới sản phẩm</h1>
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
                            min={0}
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
                            min={0}
                            value={countInStock}
                            onChange={e => setCountInStock(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='category' className='my-2'>
                        <Form.Label>Danh sách sản phẩm</Form.Label>
                        <Form.Control 
                            as='select'
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        >
                            {options.map(option => (
                                <option key={option.index} value={option.value}>{option.label}</option>
                            ))}
                        </Form.Control>
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
                    >Thêm mới</Button>
                    { isLoading && <Loader /> }
                </Form>
        </FormContainer>   
    </>
  )
  
}

export default CreateProductScreen