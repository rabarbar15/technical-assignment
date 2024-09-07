import { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../state/store'
import { fetchUsers, setFilteredUsers } from '../state/users/usersSlice'

export const UsersList = () => {

    const dispatch: AppDispatch = useDispatch()
    const filteredUsers = useSelector((state: RootState) => state.users.filteredUsers)
    const filterParams = useSelector((state: RootState) => state.users.filterParams)
    const usersStatus = useSelector((state: RootState) => state.users.status)

    useEffect(() => {
        if (usersStatus === 'idle') {
            dispatch(fetchUsers())
        }
    }, [usersStatus, dispatch])

    const handleFilterChange = (field: keyof typeof filterParams, value: string) => {
        dispatch(setFilteredUsers({ [field]: value }))
    }

    return (
        <Container className='container-fluid p-5'>

            <h3 className='display-4'>Users</h3>

            {usersStatus === 'loading' && <h3>Loading...</h3>}
            {usersStatus === 'failed' && <p>Failed to load users. Please try again.</p>}

            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">Filter by:</span>
                </div>

                <input type="text" className="form-control" placeholder="Name" value={filterParams.name} onChange={e => handleFilterChange('name', e.target.value) } />
                <input type="text" className="form-control" placeholder="Username" value={filterParams.username} onChange={e => handleFilterChange('username', e.target.value)} />
                <input type="text" className="form-control" placeholder="E-mail" value={filterParams.email} onChange={e => handleFilterChange('email', e.target.value)} />
                <input type="text" className="form-control" placeholder="Phone" value={filterParams.phone} onChange={e => handleFilterChange('phone', e.target.value)} />
            </div>

            <table className='table shadow-sm'>
                <thead className='thead-dark'>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredUsers.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Container>
    )
}
