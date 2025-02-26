import UserService from "../services/userService.js";
import logger from "../logger/logger.js";

let userService;

export function initUserService(db) {
  userService = new UserService(db);
}


export async function createUser(req, res) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
}


export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const token = await userService.authenticateUser(email, password);
    res.status(200).json({ token });
  } catch (error) {
    logger.error(`Error logging in user: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
}


export async function updateRole(req, res) {
  try {
    const { email, role } = req.body;
    console.log(email, role);
    const success = await userService.updateUserRole(email, role);
    if (success) {
      res.status(200).json({ message: "User role updated successfully." });
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    logger.error(`Error updating user role: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
}

export async function updatePassword(req, res) {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const success = await userService.updatePassword(
      email,
      currentPassword,
      newPassword
    );
    
    if (success) {
      res.status(200).json({ message: "Password updated successfully." });
    } else {
      res.status(404).json({ error: "User not found or incorrect password." });
    }
  } catch (error) {
    logger.error(`Error updating password: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
}


export async function getAccount(req, res) {
  const { email } = req.params;
  try {
    const user = await userService.getAccount(email);
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error getting account: ${error.message}`);
    res.status(404).json({ error: error.message });
  }
}


export async function blockUser(req, res) {
  const { email } = req.params;
  try {
    const success = await userService.blockUser(email);
    if (success) {
      res.status(200).json({ message: "User blocked successfully." });
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    logger.error(`Error blocking user: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
}

 
export async function unblockUser(req, res) {
  const { email } = req.params;
  try {
    const success = await userService.unblockUser(email);
    if (success) {
      res.status(200).json({ message: "User unblocked successfully." });
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    logger.error(`Error unblocking user: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
}
export async function deleteUser(req, res) {
  const { email } = req.params;
  try {
    const success = await userService.deleteUser(email);
    if (success) {
      res.status(200).json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
}
