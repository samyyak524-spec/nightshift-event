import mongoose from 'mongoose';

const eventContentSchema = new mongoose.Schema(
  {
    websiteName: { type: String, default: 'The Nightshift Event' },
    eventName: { type: String, default: 'Shama & Soul' },
    eventType: { type: String, default: 'Flea Market + Sufi Night' },
    expectedTime: { type: String, default: 'April End' },
    superAdminName: { type: String, default: 'Agamweer' },
    description: String,
    heroImage: String,
    galleryImages: [String]
  },
  { timestamps: true }
);

export const EventContent = mongoose.model('EventContent', eventContentSchema);
