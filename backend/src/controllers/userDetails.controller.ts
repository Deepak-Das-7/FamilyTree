import User from "../models/User";
import {
  getSiblings,
  getChildren,
  getGrandparents,
  getUnclesAndAunts,
  getCousins,
} from "./relationHelpers";

export const getUserDetailsById = async (id: string) => {
  const user = await User.findById(id)
    .populate("father", "_id name gender photo")
    .populate("mother", "_id name gender photo")
    .populate("spouse", "_id name gender photo");

  if (!user) return null;

  const { brothers, sisters } = await getSiblings(user);
  const { sons, daughters } = await getChildren(user);
  const grandparents = await getGrandparents(user);
  const { uncles, aunts } = await getUnclesAndAunts(user);
  const { cousins } = await getCousins(user);

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
      grandparents,
      uncles,
      aunts,
      cousins,
    },
  };
};
