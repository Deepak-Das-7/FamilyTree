// RelationGroup.tsx
import type { RelatedUser } from '../types';
import UserCard from './UserCard';

interface RelationGroupProps {
    title: string;
    people: RelatedUser[] | undefined;
}

const RelationGroup = ({ title, people }: RelationGroupProps) => (
    people && people.length > 0 ? (
        <div className="flex flex-col items-center">
            <p className="font-semibold text-sm mb-2">{title}</p>
            <div className="flex flex-wrap justify-center">
                {people.map(p => <UserCard key={p._id} user={p} />)}
            </div>
        </div>
    ) : null
);

export default RelationGroup;
