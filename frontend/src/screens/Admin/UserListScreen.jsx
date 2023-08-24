import {LinkContainer} from 'react-router-bootstrap'
import {FaTimes, FaTrash, FaEdit, FaCheck} from 'react-icons/fa'
import { Button, Table} from 'react-bootstrap'
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {useGetUsersQuery, useDeleteUserMutation} from '../../slices/usersApiSlice'
import {toast} from 'react-toastify';

const UserListScreen = () => {

  const {data: users, refetch, isLoading, error} = useGetUsersQuery();

  const [deleteUser, {isLoading: loadingDelete}] = useDeleteUserMutation();

  console.log(users);

  const deleteHandler = async (id) => {
    if(window.confirm('Bạn có muốn xóa người dùng này chứ?')) {
        try {
            await deleteUser(id);
            refetch();
            toast.success('Người dùng đã được xóa thành công')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    }
  }
    console.log(users);
  return (
    <>
      <h1>Quản lí người dùng</h1>
      {loadingDelete && <Loader />}
      {isLoading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên người dùng</th>
              <th>SĐT</th>
              <th>Tên đăng nhập</th>
              <th>Là quản trị viên</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                <td>
                    {user.isAdmin ? (
                        <FaCheck style={{color: 'green'}} />
                    ): (
                        <FaTimes style={{color: 'red'}} />
                    )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(user._id)}
                  >
                    <FaTrash style={{color: 'white'}}/>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default UserListScreen