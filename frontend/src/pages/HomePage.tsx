import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
    _id: string;
    name: string;
    gender: string;
    birthDate: string;
    photo?: string;
    deathDate?: string;
    father?: { name: string };
    mother?: { name: string };
    spouse?: { name: string };
}

const Homepage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10); // Set the number of users per page
    const navigate = useNavigate(); // Use useNavigate to get the navigate function

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('https://familytree-5qbq.onrender.com/users');
                setUsers(res.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
    );

    // Get current users for pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Navigate to /users
    const handleNavigate = () => {
        navigate('/add-new-child'); // Use navigate to navigate to /users
    };
    return (
        <div className="px-4 md:px-10 py-10 bg-gray-50 min-h-screen">
            <div className="max-w-full mx-auto bg-white shadow-xl rounded-xl p-4 md:p-6">
                {loading ? (
                    <p className="text-center text-gray-500 text-sm">Loading users...</p>
                ) : (
                    <>
                        {/* Search input and Navigate button */}
                        <div className="mb-4 flex justify-between items-center">
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Search by name..."
                                className="w-1/2 p-2 border border-gray-300 rounded-md"
                            />
                            <button
                                onClick={handleNavigate}
                                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Add new child
                            </button>
                        </div>

                        {/* Table */}
                        <div className="overflow-auto">
                            <table className="min-w-full border border-gray-200 text-sm">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-3 border-b text-left">Photo</th>
                                        <th className="py-2 px-3 border-b text-left">Name</th>
                                        <th className="py-2 px-3 border-b text-left">Gender</th>
                                        <th className="py-2 px-3 border-b text-left">Birth Date</th>
                                        <th className="py-2 px-3 border-b text-left">Death Date</th>
                                        <th className="py-2 px-3 border-b text-left">Father</th>
                                        <th className="py-2 px-3 border-b text-left">Mother</th>
                                        <th className="py-2 px-3 border-b text-left">Spouse</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user) => (
                                        <tr
                                            key={user._id}
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() => navigate(`/${user._id}`)}
                                        >
                                            <td className="py-2 px-3 border-b">
                                                {user.photo ? (
                                                    <img
                                                        src={user.photo}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-gray-400 italic">No Photo</span>
                                                )}
                                            </td>
                                            <td className="py-2 px-3 border-b">{user.name}</td>
                                            <td className="py-2 px-3 border-b">{user.gender}</td>
                                            <td className="py-2 px-3 border-b">{user.birthDate?.slice(0, 10)}</td>
                                            <td className="py-2 px-3 border-b">{user.deathDate?.slice(0, 10) || '-'}</td>
                                            <td className="py-2 px-3 border-b">{user.father?.name || '-'}</td>
                                            <td className="py-2 px-3 border-b">{user.mother?.name || '-'}</td>
                                            <td className="py-2 px-3 border-b">{user.spouse?.name || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-4 flex justify-center">
                            <nav>
                                <ul className="flex space-x-2">
                                    {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
                                        <li key={index + 1}>
                                            <button
                                                onClick={() => paginate(index + 1)}
                                                className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                                    }`}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Homepage;
