import { Volunteer } from '../models/Volunteer.js';

export const createVolunteer = async (req, res) => {
  const entry = await Volunteer.create(req.body);
  res.status(201).json(entry);
};

export const listVolunteers = async (_, res) => {
  const list = await Volunteer.find().sort({ createdAt: -1 });
  res.json(list);
};

export const updateVolunteerStatus = async (req, res) => {
  const volunteer = await Volunteer.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
  res.json(volunteer);
};
