// UserCard.tsx

import type { RelatedUser } from "../types";

const UserCard = ({ user }: { user: RelatedUser }) => (
    <div
        onClick={() => (window.location.href = `/${user._id}`)}
        className="flex items-center gap-3 p-2 m-1 rounded bg-gray-100 shadow hover:bg-gray-200 cursor-pointer w-64"
    >
        {user.photo ? (
            <img src={user.photo} className="w-12 h-12 rounded-full object-cover" />
        ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-500">
                No Photo
            </div>
        )}
        <div className="text-sm font-medium">{user.name}</div>
    </div>
);

export default UserCard;
