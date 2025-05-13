export type Gender = "Male" | "Female" | "Other";

export interface CreateUserInput {
  name: string;
  gender: Gender;
  birthDate?: Date;
  deathDate?: Date;
  photo?: string;
  biography?: string;
  father?: string;
  mother?: string;
  spouse?: string;
}

export type UpdateUserInput = Partial<CreateUserInput>;
