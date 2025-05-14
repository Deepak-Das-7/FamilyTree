import User, { IUser } from "../models/User";
import { Types } from "mongoose";

export const getUserDetailsById = async (id: string) => {
  const user = await User.findById(id)
    .populate("father", "_id name gender photo")
    .populate("mother", "_id name gender photo")
    .populate("spouse", "_id name gender photo");

  if (!user) return null;

  // ✅ Fetch siblings
  const siblingConditions = [];

  if (user.father) {
    siblingConditions.push({ father: user.father as Types.ObjectId });
  }

  if (user.mother) {
    siblingConditions.push({ mother: user.mother as Types.ObjectId });
  }

  const siblings = siblingConditions.length
    ? await User.find({
        _id: { $ne: user._id },
        $or: siblingConditions,
      }).select("_id name gender photo gender")
    : [];

  const brothers = siblings.filter((s) => s.gender === "Male");
  const sisters = siblings.filter((s) => s.gender === "Female");

  // ✅ Fetch children
  const children = await User.find({
    $or: [{ father: user._id }, { mother: user._id }],
  }).select("_id name gender photo gender");

  const sons = children.filter((child) => child.gender === "Male");
  const daughters = children.filter((child) => child.gender === "Female");

  // Grandparents and Extended Family
  let paternalGrandfather = null,
    paternalGrandmother = null,
    maternalGrandfather = null,
    maternalGrandmother = null;

  let paternalUncles: IUser[] = [],
    paternalAunts: IUser[] = [],
    maternalUncles: IUser[] = [],
    maternalAunts: IUser[] = [];

  // ✅ Fetch paternal side
  if (user.father) {
    const father = await User.findById(user.father).select("father mother");

    if (father?.father)
      paternalGrandfather = await User.findById(father.father).select(
        "_id name gender photo"
      );
    if (father?.mother)
      paternalGrandmother = await User.findById(father.mother).select(
        "_id name gender photo"
      );

    const conditions = [];
    if (father?.father) conditions.push({ father: father.father });
    if (father?.mother) conditions.push({ mother: father.mother });

    if (conditions.length) {
      const paternalSiblings = await User.find({
        _id: { $ne: user.father },
        $or: conditions,
      }).select("_id name gender photo gender");

      paternalUncles = paternalSiblings.filter((p) => p.gender === "Male");
      paternalAunts = paternalSiblings.filter((p) => p.gender === "Female");
    }
  }

  // ✅ Fetch maternal side
  if (user.mother) {
    const mother = await User.findById(user.mother).select("father mother");

    if (mother?.father)
      maternalGrandfather = await User.findById(mother.father).select(
        "_id name gender photo"
      );
    if (mother?.mother)
      maternalGrandmother = await User.findById(mother.mother).select(
        "_id name gender photo"
      );

    const conditions = [];
    if (mother?.father) conditions.push({ father: mother.father });
    if (mother?.mother) conditions.push({ mother: mother.mother });

    if (conditions.length) {
      const maternalSiblings = await User.find({
        _id: { $ne: user.mother },
        $or: conditions,
      }).select("_id name gender photo gender");

      maternalUncles = maternalSiblings.filter((p) => p.gender === "Male");
      maternalAunts = maternalSiblings.filter((p) => p.gender === "Female");
    }
  }

  // ✅ Final structured response
  return {
    me: {
      _id: user._id,
      name: user.name,
      gender: user.gender,
      photo: user.photo,
      birthDate: user.birthDate,
      deathDate: user.deathDate,
      biography: user.biography,
    },
    relations: {
      father: user.father,
      mother: user.mother,
      spouse: user.spouse,
      brothers,
      sisters,
      sons,
      daughters,
      grandparents: {
        paternal: {
          grandfather: paternalGrandfather,
          grandmother: paternalGrandmother,
        },
        maternal: {
          grandfather: maternalGrandfather,
          grandmother: maternalGrandmother,
        },
      },
      uncles: {
        paternal: paternalUncles,
        maternal: maternalUncles,
      },
      aunts: {
        paternal: paternalAunts,
        maternal: maternalAunts,
      },
    },
  };
};
