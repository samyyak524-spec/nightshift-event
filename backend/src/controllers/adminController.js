import { Admin } from '../models/Admin.js';
import { EventContent } from '../models/EventContent.js';
import { Pass } from '../models/Pass.js';
import { Ticket } from '../models/Ticket.js';
import { User } from '../models/User.js';

export const getDashboard = async (_, res) => {
  const [totalUsers, totalTickets, totalRevenue, totalVolunteers, passStats] = await Promise.all([
    User.countDocuments(),
    Ticket.countDocuments(),
    Ticket.aggregate([{ $group: { _id: null, total: { $sum: '$pricePaid' } } }]),
    (await import('../models/Volunteer.js')).Volunteer.countDocuments(),
    Pass.find().select('passName phaseName price remainingQuantity totalQuantity status')
  ]);

  res.json({
    totalUsers,
    totalTickets,
    totalRevenue: totalRevenue[0]?.total || 0,
    totalVolunteers,
    passStats
  });
};

export const getEventContent = async (_, res) => {
  let content = await EventContent.findOne();
  if (!content) content = await EventContent.create({});
  res.json(content);
};

export const updateEventContent = async (req, res) => {
  let content = await EventContent.findOne();
  if (!content) content = await EventContent.create(req.body);
  else Object.assign(content, req.body);
  await content.save();
  res.json(content);
};

export const addAdmin = async (req, res) => {
  const { userId, permissions = [] } = req.body;
  const admin = await Admin.create({ user: userId, permissions, createdBy: req.user.sub });
  await User.findByIdAndUpdate(userId, { role: 'admin' });
  res.status(201).json(admin);
};

export const removeAdmin = async (req, res) => {
  const admin = await Admin.findByIdAndDelete(req.params.id);
  if (!admin) return res.status(404).json({ message: 'Admin not found' });
  await User.findByIdAndUpdate(admin.user, { role: 'user' });
  res.json({ message: 'Admin removed' });
};
