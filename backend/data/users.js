import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Khang Admin',
        email: 'nguyendkhang9999@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true,
    },
    {
        name: 'Trang',
        email: 'trang@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false,
    },
    {
        name: 'Chau',
        email: 'chau@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false,
    },
];
export default users;