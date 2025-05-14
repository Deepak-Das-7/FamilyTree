import React, { useState, useEffect } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';

type User = {
    _id: string;
    name: string;
};
const AddUser: React.FC = () => {
    const navigate = useNavigate(); // Use useNavigate to get the navigate function

    const [name, setName] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
    const [birthDate, setBirthDate] = useState('');
    const [deathDate, setDeathDate] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [photoName, setPhotoName] = useState<string>('');
    const [photoSize, setPhotoSize] = useState<string>('');

    const [biography, setBiography] = useState('');

    const [fatherList, setFatherList] = useState<User[]>([]);
    const [motherList, setMotherList] = useState<User[]>([]);
    const [spouseList, setSpouseList] = useState<User[]>([]);

    const [father, setFather] = useState('');
    const [mother, setMother] = useState('');
    const [spouse, setSpouse] = useState('');


    useEffect(() => {
        if (!birthDate) return; // Only run when birthDate is present

        const fetchLists = async () => {
            try {
                const [fatherRes, motherRes, spouseRes] = await Promise.all([
                    axios.get(`https://familytree-5qbq.onrender.com/users/list/fatherList?date=${birthDate}`),
                    axios.get(`https://familytree-5qbq.onrender.com/users/list/motherList?date=${birthDate}`),
                    axios.get(`https://familytree-5qbq.onrender.com/users/list/spouceList?date=${birthDate}&gender=${gender}`)
                ]);

                setFatherList(Array.isArray(fatherRes.data) ? fatherRes.data : []);
                setMotherList(Array.isArray(motherRes.data) ? motherRes.data : []);
                setSpouseList(Array.isArray(spouseRes.data) ? spouseRes.data : []);
            } catch (err) {
                console.error("Error fetching family lists:", err);
                setFatherList([]);
                setMotherList([]);
                setSpouseList([]);
            }
        };

        fetchLists();
    }, [birthDate, gender]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const userData = {
                name,
                gender,
                birthDate,
                deathDate,
                photo,
                biography,
                father,
                mother,
                spouse
            };

            const response = await axios.post('https://familytree-5qbq.onrender.com/users', userData);
            console.log('User created:', response.data);
            alert('User created successfully!');
            setName("")
            setBirthDate("")
            setPhoto("")
            setBiography("")
            setFather("")
            setMother("")
            setSpouse("")
            navigate('/'); // Use navigate to navigate to /users
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Error creating user. Please try again.');
        }
    };


    const inputClass = "w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div className="w-full px-4 md:px-10 py-10 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-8 md:p-10">
                <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Add New Member</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Gender</label>
                        <select className={inputClass} value={gender} onChange={(e) => setGender(e.target.value as any)}>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input type="date" className={inputClass} value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Date of Death</label>
                        <input type="date" className={inputClass} value={deathDate} onChange={(e) => setDeathDate(e.target.value)} />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Father</label>
                        <select className={inputClass} value={father} onChange={(e) => setFather(e.target.value)}>
                            <option value="">Select Father</option>
                            {fatherList.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
                        </select>
                    </div>



                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Mother</label>
                        <select className={inputClass} value={mother} onChange={(e) => setMother(e.target.value)}>
                            <option value="">Select Mother</option>
                            {motherList.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
                        </select>
                    </div>

                    <div className="md:col-span-3">
                        <label className="block font-medium text-gray-700 mb-1">Spouse</label>
                        <select className={inputClass} value={spouse} onChange={(e) => setSpouse(e.target.value)}>
                            <option value="">Select Spouse</option>
                            {spouseList.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
                        </select>
                    </div>

                    {/* Photo Upload */}
                    <div className="md:col-span-3">
                        <label className="block font-medium text-gray-700 mb-2">Upload Photo</label>
                        <div className="flex items-center gap-6 flex-wrap">
                            {photo && (
                                <>
                                    <img
                                        src={photo}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded border shadow"
                                    />
                                    <div className="text-sm text-gray-600">
                                        <p>File Name: {photoName}</p>
                                        <p>File Size: {photoSize} KB</p>
                                    </div>
                                </>
                            )}
                            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
                                Select Photo
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => setPhoto(reader.result as string);

                                            // Set the photo's name and size
                                            setPhotoName(file.name);
                                            setPhotoSize((file.size / 1024).toFixed(2)); // Convert size to KB

                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Biography */}
                    <div className="md:col-span-3">
                        <label className="block font-medium text-gray-700 mb-1">Biography</label>
                        <textarea className={inputClass} rows={4} value={biography} onChange={(e) => setBiography(e.target.value)} />
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-3">
                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition-all shadow">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
