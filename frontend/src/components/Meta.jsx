import {Helmet} from 'react-helmet-async'

const Meta = ({title, description, keywords}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
    title: 'Chào mừng bạn đến với kkShop',
    description: 'Chúc tôi rất hân hạnh được phục vụ quý khách cũng như mang đến những sản phẩm tuyệt vời đến tay khách hàng',
    keywords: 'Sản phẩm chất lượng, giá cả tốt trên thị trường'
};

export default Meta