import User, { IUser } from "../models/User";
import { Types } from "mongoose";

export const getSiblings = async (user: IUser) => {
  const siblingConditions = [];

  if (user.father)
    siblingConditions.push({ father: user.father as Types.ObjectId });
  if (user.mother)
    siblingConditions.push({ mother: user.mother as Types.ObjectId });

  const siblings = siblingConditions.length
    ? await User.find({
        _id: { $ne: user._id },
        $or: siblingConditions,
      }).select("_id name gender photo gender")
    : [];

  const brothers = siblings.filter((s) => s.gender === "Male");
  const sisters = siblings.filter((s) => s.gender === "Female");

  return { brothers, sisters };
};

export const getChildren = async (user: IUser) => {
  const children = await User.find({
    $or: [{ father: user._id }, { mother: user._id }],
  }).select("_id name gender photo gender");

  const sons = children.filter((child) => child.gender === "Male");
  const daughters = children.filter((child) => child.gender === "Female");

  return { sons, daughters };
};

export const getGrandparents = async (user: IUser) => {
  let paternalGrandfather = null,
    paternalGrandmother = null;
  let maternalGrandfather = null,
    maternalGrandmother = null;

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
  }

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
  }

  return {
    paternal: {
      grandfather: paternalGrandfather,
      grandmother: paternalGrandmother,
    },
    maternal: {
      grandfather: maternalGrandfather,
      grandmother: maternalGrandmother,
    },
  };
};

export const getUnclesAndAunts = async (user: IUser) => {
  // ✅ Helper to process siblings + their spouses
  const processSiblings = async (
    parentId: Types.ObjectId | undefined | null
  ) => {
    if (!parentId) return { uncles: [], aunts: [] };

    const parent = await User.findById(parentId).select("father mother");
    const conditions = [];
    if (parent?.father) conditions.push({ father: parent.father });
    if (parent?.mother) conditions.push({ mother: parent.mother });

    if (!conditions.length) return { uncles: [], aunts: [] };

    const siblings = await User.find({
      _id: { $ne: parentId },
      $or: conditions,
    })
      .select("_id name gender photo gender spouse")
      .populate("spouse", "_id name gender photo gender");

    const uncles: IUser[] = [];
    const aunts: IUser[] = [];

    for (const s of siblings) {
      if (s.gender === "Male") {
        uncles.push(s); // biological uncle
        const spouse = s.spouse as IUser | undefined;
        if (spouse?.gender === "Female") {
          aunts.push(spouse); // uncle's wife
        }
      } else if (s.gender === "Female") {
        aunts.push(s); // biological aunt
        const spouse = s.spouse as IUser | undefined;
        if (spouse?.gender === "Male") {
          uncles.push(spouse); // aunt's husband
        }
      }
    }

    return { uncles, aunts };
  };

  // 🔍 Use ObjectId type from mongoose to avoid unnecessary casts
  const paternal = await processSiblings(user.father ?? null);
  const maternal = await processSiblings(user.mother ?? null);

  return {
    uncles: {
      paternal: paternal.uncles,
      maternal: maternal.uncles,
    },
    aunts: {
      paternal: paternal.aunts,
      maternal: maternal.aunts,
    },
  };
};

/**
 * Returns cousins of the given user by looking up children of their uncles and aunts.
 */
export const getCousins = async (user: IUser) => {
  let paternalUncleAuntIds: string[] = [];
  let maternalUncleAuntIds: string[] = [];

  // 🧔🏻‍♂️ Paternal Side
  if (user.father) {
    const father = await User.findById(user.father).select("father mother");

    const conditions = [];
    if (father?.father) conditions.push({ father: father.father });
    if (father?.mother) conditions.push({ mother: father.mother });

    if (conditions.length) {
      const paternalSiblings = await User.find({
        _id: { $ne: user.father },
        $or: conditions,
      }).select("_id");

      paternalUncleAuntIds = paternalSiblings.map((p) =>
        (p._id as Types.ObjectId).toString()
      );
    }
  }

  // 👩🏻 Maternal Side
  if (user.mother) {
    const mother = await User.findById(user.mother).select("father mother");

    const conditions = [];
    if (mother?.father) conditions.push({ father: mother.father });
    if (mother?.mother) conditions.push({ mother: mother.mother });

    if (conditions.length) {
      const maternalSiblings = await User.find({
        _id: { $ne: user.mother },
        $or: conditions,
      }).select("_id");

      maternalUncleAuntIds = maternalSiblings.map((m) =>
        (m._id as Types.ObjectId).toString()
      );
    }
  }

  // 👦 Cousins (children of uncles/aunts)
  const cousins = await User.find({
    $or: [
      { father: { $in: [...paternalUncleAuntIds, ...maternalUncleAuntIds] } },
      { mother: { $in: [...paternalUncleAuntIds, ...maternalUncleAuntIds] } },
    ],
  }).select("_id name gender photo");

  return { cousins };
};
