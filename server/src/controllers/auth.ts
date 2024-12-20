import { RequestHandler } from 'express';
import userService from '@/services/user';
import sessionService from '@/services/session';
import bcrypt from 'bcryptjs';

const processSignUp: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await userService.create({ username, password });
    req.session.userId = newUser._id;
    await sessionService.save(req);
    return res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const processSignIn: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userService.fetch({ username });
    if (!user || user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      user[0].passwordHash,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }
    req.session.userId = user[0]._id;
    await sessionService.save(req);
    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

const processSignOut: RequestHandler = async (req, res) => {
  try {
    await sessionService.destroy(req);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export { processSignUp, processSignIn, processSignOut };
