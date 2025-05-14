export interface RelatedUser {
  _id: string;
  name: string;
  gender: string;
  photo?: string;
}

export interface User extends RelatedUser {
  birthDate?: string;
  deathDate?: string;
  biography?: string;
  father?: RelatedUser;
  mother?: RelatedUser;
  spouse?: RelatedUser;
  children?: RelatedUser[];
  siblings?: RelatedUser[];
  cousins?: RelatedUser[];
  grandparents?: RelatedUser[];
  unclesAunts?: RelatedUser[];
  createdAt?: string;
  updatedAt?: string;
}
