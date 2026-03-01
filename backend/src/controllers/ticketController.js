import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { Pass } from '../models/Pass.js';
import { Payment } from '../models/Payment.js';
import { Ticket } from '../models/Ticket.js';
import { sendTicketEmail } from '../services/emailService.js';
import { razorpay, verifyRazorpaySignature } from '../services/razorpayService.js';
import { User } from '../models/User.js';

const buildPurchasablePassFilter = (passId, now = new Date()) => ({
  _id: passId,
  status: 'active',
  remainingQuantity: { $gt: 0 },
  saleStartDate: { $lte: now },
  saleEndDate: { $gte: now }
});

export const createOrder = async (req, res) => {
  try {
    const { passId } = req.body;
    if (!passId) return res.status(400).json({ message: 'passId is required' });

    const pass = await Pass.findOne(buildPurchasablePassFilter(passId));
    if (!pass) {
      return res.status(400).json({ message: 'Pass unavailable, sold out, or outside sale window' });
    }

    const order = await razorpay.orders.create({
      amount: pass.price * 100,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    });

    await Payment.create({
      user: req.user.sub,
      pass: pass._id,
      amount: pass.price,
      razorpayOrderId: order.id
    });

    return res.status(201).json({ order, pass });
  } catch (error) {
    console.error('[createOrder] failed', { userId: req.user?.sub, error: error.message });
    return res.status(500).json({ message: 'Unable to create payment order' });
  }
};

export const verifyPaymentAndIssueTicket = async (req, res) => {
  let payment;
  let pass;

  try {
    const { passId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!passId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing payment verification fields' });
    }

    const verified = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature
    });
    if (!verified) return res.status(400).json({ message: 'Payment signature invalid' });

    payment = await Payment.findOneAndUpdate(
      {
        razorpayOrderId,
        user: req.user.sub,
        pass: passId,
        status: 'created'
      },
      { razorpayPaymentId, razorpaySignature, status: 'captured' },
      { new: true }
    );

    if (!payment) {
      const existingPayment = await Payment.findOne({ razorpayOrderId, user: req.user.sub, pass: passId });
      if (!existingPayment) return res.status(404).json({ message: 'Payment not found' });
      return res.status(409).json({ message: 'Payment already processed for this order' });
    }

    pass = await Pass.findOneAndUpdate(
      buildPurchasablePassFilter(passId),
      { $inc: { remainingQuantity: -1 } },
      { new: true }
    );

    if (!pass) {
      await Payment.findByIdAndUpdate(payment._id, { status: 'failed' });
      return res.status(409).json({ message: 'Pass unavailable at payment confirmation time' });
    }

    if (pass.remainingQuantity <= 0) {
      await Pass.findByIdAndUpdate(pass._id, { status: 'sold_out' });
      pass.status = 'sold_out';
    }

    const ticketId = `NSE-${uuidv4().split('-')[0].toUpperCase()}`;
    const qrPayload = JSON.stringify({ ticketId, passId, event: 'Shama & Soul' });
    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload);

    const ticket = await Ticket.create({
      ticketId,
      qrCodeDataUrl,
      user: req.user.sub,
      pass: pass._id,
      passName: pass.passName,
      phaseName: pass.phaseName,
      pricePaid: pass.price,
      paymentId: razorpayPaymentId
    });

    const user = await User.findById(req.user.sub);
    sendTicketEmail({
      to: user?.email,
      ticketId,
      qrCodeDataUrl,
      passName: pass.passName,
      phaseName: pass.phaseName
    }).catch((error) => {
      console.error('[sendTicketEmail] failed', { ticketId, userId: req.user?.sub, error: error.message });
    });

    return res.status(201).json(ticket);
  } catch (error) {
    console.error('[verifyPaymentAndIssueTicket] failed', {
      userId: req.user?.sub,
      orderId: req.body?.razorpayOrderId,
      error: error.message
    });

    if (payment?._id) {
      await Payment.findByIdAndUpdate(payment._id, { status: 'failed' }).catch(() => {});
    }

    if (pass?._id) {
      await Pass.findByIdAndUpdate(pass._id, {
        $inc: { remainingQuantity: 1 },
        ...(pass.status === 'sold_out' ? { status: 'active' } : {})
      }).catch(() => {});
    }

    return res.status(500).json({ message: 'Unable to issue ticket after payment verification' });
  }
};

export const myTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.sub }).sort({ createdAt: -1 });
    return res.json(tickets);
  } catch (error) {
    console.error('[myTickets] failed', { userId: req.user?.sub, error: error.message });
    return res.status(500).json({ message: 'Unable to fetch tickets' });
  }
};

export const scanTicket = async (req, res) => {
  try {
    const ticketId = req.body?.ticketId?.trim();
    if (!ticketId) return res.status(400).json({ message: 'ticketId is required' });

    const checkedInAt = new Date();

    const ticket = await Ticket.findOneAndUpdate(
      { ticketId, entryStatus: 'unused' },
      { $set: { entryStatus: 'used', checkedInAt } },
      { new: true }
    ).populate('user');

    if (ticket) {
      return res.json({
        message: 'Entry approved. Ticket marked as used.',
        ticket
      });
    }

    const existingTicket = await Ticket.findOne({ ticketId }).populate('user');
    if (!existingTicket) return res.status(404).json({ message: 'Ticket not found' });

    if (existingTicket.entryStatus === 'used') {
      return res.status(409).json({
        message: 'Entry denied. Ticket already used.',
        ticket: existingTicket
      });
    }

    return res.status(409).json({
      message: 'Entry denied. Ticket is not eligible for check-in.',
      ticket: existingTicket
    });
  } catch (error) {
    console.error('[scanTicket] failed', { ticketId: req.body?.ticketId, error: error.message });
    return res.status(500).json({ message: 'Unable to verify ticket at this time' });
  }
};
