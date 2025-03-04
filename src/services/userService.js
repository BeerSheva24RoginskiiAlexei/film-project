import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "24h";

export default class UserService {
  constructor(mongoConnection) {
    this.collection = mongoConnection.getCollection("users");
  }

  async createUser(userData) {
    const { name, password, expiration, role = "USER" } = userData;

    const existingUser = await this.collection.findOne({ _id: userData._id });
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = {
      _id: userData._id,
      name,
      role,
      hashPassword,
      expiration: expiration,
      blocked: false,
    };

    await this.collection.insertOne(newUser);
    return newUser;
  }

  // Аутентификация
  async authenticateUser(email, password) {
    const user = await this.collection.findOne({ _id: email });

    if (!user || user.blocked) {
      throw new Error("User not found or account is blocked.", user);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.hashPassword);
    if (!isPasswordCorrect) {
      throw new Error("Invalid password.");
    }

    if (!JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is not defined. Please check your environment variables."
      );
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
    return token;
  }

  // Обновление роли
  async updateUserRole(email, newRole) {
    const result = await this.collection.updateOne(
      { _id: email },
      { $set: { role: newRole } }
    );
    return result.modifiedCount > 0;
  }

  async updatePassword(email, currentPassword, newPassword) {
    if (!newPassword) {
      throw new Error("New password is required");
    }

    const user = await this.collection.findOne({ _id: email });
    if (!user || user.blocked) {
      throw new Error("User not found or account is blocked.");
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.hashPassword
    );
    if (!isPasswordCorrect) {
      throw new Error("Invalid current password.");
    }

    const hashPasword = await bcrypt.hash(newPassword, 10);
    await this.collection.updateOne({ _id: email }, { $set: { hashPasword } });

    return { message: "Password updated successfully" };
  }

  // Блокировка
  async blockUser(email) {
    const result = await this.collection.updateOne(
      { _id: email },
      { $set: { blocked: true } }
    );
    return result.modifiedCount > 0;
  }

  // Разблокировка
  async unblockUser(email) {
    const result = await this.collection.updateOne(
      { _id: email },
      { $set: { blocked: false } }
    );
    return result.modifiedCount > 0;
  }

  // get user
  async getAccount(email) {
    const user = await this.collection.findOne({ _id: email });
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  }

  // Удаление
  async deleteUser(email) {
    const result = await this.collection.deleteOne({ _id: email });
    return result.deletedCount > 0;
  }
}
