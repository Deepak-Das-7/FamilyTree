// UserDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { RelatedUser, User } from "../types";
import RelationGroup from "../components/RelationGroup";



const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`https://familytree-5qbq.onrender.com/usersDetails/${id}`);
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

                const children: RelatedUser[] = [
                    ...(data.relations.sons || []),
                    ...(data.relations.daughters || []),
                ];

                const cousins: RelatedUser[] = [
                    ...(data.relations.cousins || [])
                ];

                const transformedUser: User = {
                    ...data.me,
                    father: data.relations.father,
                    mother: data.relations.mother,
                    spouse: data.relations.spouse,
                    siblings,
                    grandparents,
                    unclesAunts,
                    children,
                    cousins,
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

    return (
        <div className="p-6 overflow-x-auto min-h-screen">
            <h1 className="text-2xl font-bold text-center mb-4">Family Tree</h1>

            <div className="flex flex-col items-center space-y-6">

                {/* Grandparents */}
                <RelationGroup title="Grandparents" people={user.grandparents} />

                {/* Parents & Uncles/Aunts */}
                <div className="flex flex-row justify-center items-start space-x-6">
                    {/* Parents */}
                    {(user.father || user.mother) && (
                        <RelationGroup
                            title="Parents"
                            people={[user.father, user.mother].filter(Boolean) as RelatedUser[]}
                        />
                    )}


                    {/* Uncles and Aunts */}
                    <RelationGroup title="Uncles and Aunts" people={user.unclesAunts} />
                </div>

                {/* Siblings + Me + Spouse in One Row with Separate Titles */}
                <div className="flex flex-row justify-center items-start space-x-6">
                    <RelationGroup title="Brothers" people={user.siblings?.filter(s => s.gender === "Male")} />
                    <div className="flex flex-col items-center space-y-1">
                        <p className="font-semibold text-sm">Me</p>
                        <div className="flex justify-center">
                            <div className="flex flex-col items-center p-2 m-1 rounded bg-blue-100 border border-blue-300 shadow w-28">
                                {user.photo ? (
                                    <img
                                        src={user.photo}
                                        className="w-14 h-14 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-500">
                                        No Photo
                                    </div>
                                )}
                                <p className="text-center text-sm mt-1 font-semibold">{user.name}</p>
                            </div>
                        </div>
                    </div>
                    <RelationGroup title="Spouse" people={user.spouse ? [user.spouse] : []} />
                    <RelationGroup title="Sisters" people={user.siblings?.filter(s => s.gender === "Female")} />
                    <RelationGroup title="Cousins" people={user.cousins} />
                </div>

                {/* Children */}
                <RelationGroup title="Sons" people={user.children?.filter(c => c.gender === "Male")} />
                <RelationGroup title="Daughters" people={user.children?.filter(c => c.gender === "Female")} />
            </div>
        </div>
    );
};

export default UserDetail;
