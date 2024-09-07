import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const URL = 'https://jsonplaceholder.typicode.com/users'

interface User {
    id: number,
    name: string,
    username: string,
    email: string,
    phone: string
}

interface UsersState {
    users: User[],
    filteredUsers: User[],
    filterParams: {
        name: string,
        username: string,
        email: string,
        phone: string
    },
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: UsersState = {
    users: [],
    filteredUsers: [],
    filterParams: {
        name: '',
        username: '',
        email: '',
        phone: ''
    },
    status: 'idle' 
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await fetch(URL);
    return (await response.json()) as User[];
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers(state, action: PayloadAction<User[]>) {
            state.users = action.payload
            state.filteredUsers = action.payload
        },
        setFilteredUsers(state, action: PayloadAction<Partial<UsersState['filterParams']>>) {
            state.filterParams = { ...state.filterParams, ...action.payload }
            state.filteredUsers = state.users.filter(user => 
                user.name.toLowerCase().includes(state.filterParams.name.toLowerCase()) &&
                user.username.toLowerCase().includes(state.filterParams.username.toLowerCase()) &&
                user.email.toLowerCase().includes(state.filterParams.email.toLowerCase()) &&
                user.phone.includes(state.filterParams.phone)
            )
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
                state.filteredUsers = action.payload;
            })
            .addCase(fetchUsers.rejected, (state) => {
                state.status = 'failed';
            });
    },
})

export const { setUsers, setFilteredUsers } = usersSlice.actions;

export default usersSlice.reducer;