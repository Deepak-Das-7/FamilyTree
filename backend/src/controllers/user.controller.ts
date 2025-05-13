import User from "../models/User";
import { Types } from "mongoose";
import { subYears, parseISO } from "date-fns";

import { CreateUserInput, UpdateUserInput } from "./userType";

// Create a new user
export const createUser = async (data: CreateUserInput) => {
  try {
    // Create the new user
    const newUser = new User({
      ...data,
      father: data.father ? new Types.ObjectId(data.father) : undefined,
      mother: data.mother ? new Types.ObjectId(data.mother) : undefined,
      spouse: data.spouse ? new Types.ObjectId(data.spouse) : undefined,
    });
    // If a spouse is provided, update the spouse's spouse field
    if (data.spouse) {
      await User.findByIdAndUpdate(
        data.spouse,
        { spouse: newUser._id },
        { new: true }
      );
    }

    // Save the new user and return it
    return await newUser.save();
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Error creating user.");
  }
};

// Update a user
export const updateUser = async (id: string, data: UpdateUserInput) => {
  const updateData: any = { ...data };

  if (data.father) updateData.father = new Types.ObjectId(data.father);
  if (data.mother) updateData.mother = new Types.ObjectId(data.mother);
  if (data.spouse) updateData.spouse = new Types.ObjectId(data.spouse);

  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

// Get a user by ID (with family info populated)
export const getUserById = async (id: string) => {
  return await User.findById(id)
    .populate("father", "name gender photo")
    .populate("mother", "name gender photo")
    .populate("spouse", "name gender photo");
};
// Get all users
export const getAllUsers = async () => {
  return await User.find()
    .populate("father", "name gender photo")
    .populate("mother", "name gender photo")
    .populate("spouse", "name gender photo")
    .sort({ createdAt: -1 });
};
// Delete a user
export const deleteUser = async (id: string) => {
  return await User.findByIdAndDelete(id);
};

// Get father list
export const getFathers = async (date: string) => {
  const inputDate = parseISO(date);

  const start = subYears(inputDate, 35);
  const end = subYears(inputDate, 10);
  // console.log(start, end, "getFathers");

  return await User.find({
    birthDate: {
      $gte: start,
      $lte: end,
    },
    gender: "Male",
  }).sort({ createdAt: -1 });
};

// Get mother list
export const getMothers = async (date: string) => {
  const inputDate = parseISO(date);

  const start = subYears(inputDate, 40);
  const end = subYears(inputDate, 10);
  // console.log(start, end, "getMothers");

  return await User.find({
    birthDate: {
      $gte: start,
      $lte: end,
    },
    gender: "Female",
  }).sort({ createdAt: -1 });
};

// Get mother list
export const getSpouces = async (date: string, gender: string) => {
  const inputDate = parseISO(date);

  const start = subYears(inputDate, 10);
  const end = subYears(inputDate, -10);
  // console.log(start, end, gender, "getSpouces");
  return await User.find({
    birthDate: {
      $gte: start,
      $lte: end,
    },
    gender: gender === "Male" ? "Female" : "Male",
  }).sort({ createdAt: -1 });
};
