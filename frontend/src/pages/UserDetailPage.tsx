import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface RelatedUser {
    _id: string;
    name: string;
    gender: string;
    photo?: string;
}

interface User extends RelatedUser {
    birthDate?: string;
    deathDate?: string;
    biography?: string;
    father?: RelatedUser;
    mother?: RelatedUser;
    spouse?: RelatedUser;
    children?: RelatedUser[];
    siblings?: RelatedUser[];
    grandparents?: RelatedUser[];
    unclesAunts?: RelatedUser[];
    createdAt?: string;
    updatedAt?: string;
}

const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/usersDetails/${id}`);
                const data = res.data;

                const siblings: RelatedUser[] = [
                    ...(data.relations.brothers || []),
                    ...(data.relations.sisters || []),
                ];

                const grandparents: RelatedUser[] = [
                    ...(data.relations.grandparents?.paternal?.grandfather ? [data.relations.grandparents.paternal.grandfather] : []),
                    ...(data.relations.grandparents?.paternal?.grandmother ? [data.relations.grandparents.paternal.grandmother] : []),
                    ...(data.relations.grandparents?.maternal?.grandfather ? [data.relations.grandparents.maternal.grandfather] : []),
                    ...(data.relations.grandparents?.maternal?.grandmother ? [data.relations.grandparents.maternal.grandmother] : []),
                ];

                const unclesAunts: RelatedUser[] = [
                    ...(data.relations.uncles?.paternal || []),
                    ...(data.relations.uncles?.maternal || []),
                    ...(data.relations.aunts?.paternal || []),
                    ...(data.relations.aunts?.maternal || []),
                ];

                const transformedUser: User = {
                    ...data.me,
                    father: data.relations.father,
                    mother: data.relations.mother,
                    spouse: data.relations.spouse,
                    siblings,
                    grandparents,
                    unclesAunts,
                };

                setUser(transformedUser);
            } catch (err) {
                console.error("Failed to fetch user", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    if (loading) return <p className="p-4">Loading...</p>;
    if (!user) return <p className="p-4">User not found</p>;

    const UserCard = ({ user }: { user: RelatedUser }) => (
        <div
            onClick={() => (window.location.href = `/${user._id}`)}
            className="flex items-center gap-3 p-2 m-1 rounded bg-gray-100 shadow hover:bg-gray-200 cursor-pointer w-64"
        >
            {user.photo ? (
                <img src={user.photo} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-500">
                    No Photo
                </div>
            )}
            <div className="text-sm font-medium">{user.name}</div>
        </div>
    );

    const getRelationGroup = (title: string, people: RelatedUser[] | undefined) =>
        people && people.length > 0 ? (
            <div className="flex flex-col items-center">
                <p className="font-semibold text-sm mb-2">{title}</p>
                <div className="flex flex-wrap justify-center">{people.map(p => <UserCard key={p._id} user={p} />)}</div>
            </div>
        ) : null;

    return (
        <div className="p-6 overflow-x-auto min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-4">Family Tree</h1>

            <div className="flex flex-col items-center space-y-6">

                {/* Grandparents */}
                {getRelationGroup("Grandparents", user.grandparents)}

                {/* Parents & Uncles/Aunts */}
                <div className="flex flex-col items-center space-y-1">
                    <p className="font-semibold text-sm">Parents, Uncles & Aunts</p>
                    <div className="flex flex-wrap justify-center">
                        {user.unclesAunts?.filter(p => p.gender === "Male").map(p => <UserCard key={p._id} user={p} />)}
                        {user.father && <UserCard user={user.father} />}
                        {user.mother && <UserCard user={user.mother} />}
                        {user.unclesAunts?.filter(p => p.gender === "Female").map(p => <UserCard key={p._id} user={p} />)}
                    </div>
                </div>

                {/* Siblings + Me + Spouse */}
                <div className="flex flex-col items-center space-y-1">
                    <p className="font-semibold text-sm">Siblings, Me & Spouse</p>
                    <div className="flex flex-wrap justify-center items-center gap-2">
                        {user.siblings?.filter(s => s.gender === "Male").map(s => <UserCard key={s._id} user={s} />)}

                        <div className="flex flex-col items-center p-2 m-1 rounded bg-blue-100 border border-blue-300 shadow w-28">
                            {user.photo ? (
                                <img src={user.photo} className="w-14 h-14 rounded-full object-cover" />
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-500">No Photo</div>
                            )}
                            <p className="text-center text-sm mt-1 font-semibold">{user.name} (Me)</p>
                        </div>

                        {user.spouse && <UserCard user={user.spouse} />}
                        {user.siblings?.filter(s => s.gender === "Female").map(s => <UserCard key={s._id} user={s} />)}
                    </div>
                </div>

                {/* Children (if any in future) */}
                {getRelationGroup("Children", user.children)}
            </div>
        </div>
    );
};

export default UserDetail;
