import { Pass } from '../models/Pass.js';

const normalizePassPayload = (payload) => {
  const normalized = { ...payload };

  if (normalized.totalQuantity !== undefined) {
    const totalQuantity = Number(normalized.totalQuantity);
    if (!Number.isFinite(totalQuantity)) return null;
    normalized.totalQuantity = Math.max(0, totalQuantity);
  }

  if (normalized.remainingQuantity !== undefined) {
    const remainingQuantity = Number(normalized.remainingQuantity);
    if (!Number.isFinite(remainingQuantity)) return null;
    normalized.remainingQuantity = Math.max(0, remainingQuantity);
  }

  if (normalized.totalQuantity !== undefined && normalized.remainingQuantity !== undefined) {
    normalized.remainingQuantity = Math.min(normalized.remainingQuantity, normalized.totalQuantity);
  }

  return normalized;
};

export const listPublicPasses = async (_, res) => {
  try {
    const now = new Date();
    const passes = await Pass.find({
      status: 'active',
      saleStartDate: { $lte: now },
      saleEndDate: { $gte: now },
      remainingQuantity: { $gt: 0 }
    }).sort({ sortOrder: 1, price: 1 });

    return res.json(passes);
  } catch (error) {
    console.error('[listPublicPasses] failed', { error: error.message });
    return res.status(500).json({ message: 'Unable to fetch passes' });
  }
};

export const listAllPasses = async (_, res) => {
  try {
    const passes = await Pass.find().sort({ sortOrder: 1, createdAt: 1 });
    return res.json(passes);
  } catch (error) {
    console.error('[listAllPasses] failed', { error: error.message });
    return res.status(500).json({ message: 'Unable to fetch passes' });
  }
};

export const createPass = async (req, res) => {
  try {
    const payload = normalizePassPayload(req.body);
    if (!payload) return res.status(400).json({ message: 'Invalid quantity values' });

    if (payload.remainingQuantity === undefined && payload.totalQuantity !== undefined) {
      payload.remainingQuantity = payload.totalQuantity;
    }

    if (payload.remainingQuantity === 0 && payload.status === 'active') {
      payload.status = 'sold_out';
    }

    const pass = await Pass.create(payload);
    return res.status(201).json(pass);
  } catch (error) {
    console.error('[createPass] failed', { error: error.message });
    return res.status(500).json({ message: 'Unable to create pass' });
  }
};

export const updatePass = async (req, res) => {
  try {
    const existing = await Pass.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Pass not found' });

    const merged = {
      ...existing.toObject(),
      ...req.body
    };
    const payload = normalizePassPayload(merged);
    if (!payload) return res.status(400).json({ message: 'Invalid quantity values' });

    delete payload._id;
    delete payload.__v;
    delete payload.createdAt;
    delete payload.updatedAt;

    if (payload.remainingQuantity <= 0 && payload.status === 'active') {
      payload.status = 'sold_out';
    }

    const pass = await Pass.findByIdAndUpdate(req.params.id, payload, { new: true });
    return res.json(pass);
  } catch (error) {
    console.error('[updatePass] failed', { passId: req.params.id, error: error.message });
    return res.status(500).json({ message: 'Unable to update pass' });
  }
};

export const reorderPasses = async (req, res) => {
  try {
    const { orders } = req.body;
    await Promise.all(orders.map(({ id, sortOrder }) => Pass.findByIdAndUpdate(id, { sortOrder })));
    return res.json({ message: 'Passes reordered' });
  } catch (error) {
    console.error('[reorderPasses] failed', { error: error.message });
    return res.status(500).json({ message: 'Unable to reorder passes' });
  }
};
