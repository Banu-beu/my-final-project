
import { Request, Response } from "express";
import {
  createMessage,
  errorMessage,
  deleteMessage,
  editMessage,
} from "../../utils/infoMessages";
import { Users, validateUser } from "./user.model";

export const allUsers = async (req: Request, res: Response) => {
  try {
    const users = await Users.findAll({
      attributes: { exclude: ["password", "accessToken", "refreshToken"] },
    });
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};

export const singleUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const user = await Users.findByPk(id, {
      attributes: { exclude: ["password", "accessToken", "refreshToken"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json(errorMessage("Validate error", error));
    }

    const user = await Users.findByPk(Number(req.params.id));
    if (!user) {
      return res.status(404).json(errorMessage("User not found"));
    }

    await user.update(req.body);
    res.status(200).json(editMessage("User updated", user));
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await Users.findByPk(Number(req.params.id));
    if (!user) {
      return res.status(404).json(errorMessage("User not found"));
    }

    await user.destroy();
    res.status(200).json(deleteMessage("User", user));
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};