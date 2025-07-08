import { Schema, model, models } from 'mongoose';

export interface ISettings {
  requireEmailVerification: boolean;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  maxUsersPerPage: number;
  lastUpdated: Date;
}

const settingsSchema = new Schema<ISettings>({
  requireEmailVerification: {
    type: Boolean,
    default: true,
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  allowNewRegistrations: {
    type: Boolean,
    default: true,
  },
  maxUsersPerPage: {
    type: Number,
    default: 10,
    min: 1,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Ensure only one settings document exists
settingsSchema.pre('save', async function(next) {
  const count = await (this.constructor as typeof Settings).countDocuments();
  if (count > 0 && this.isNew) {
    throw new Error('Only one settings document can exist');
  }
  next();
});

const Settings = models.Settings || model<ISettings>('Settings', settingsSchema);

// Initialize default settings if none exist
export async function initializeSettings() {
  const count = await Settings.countDocuments();
  if (count === 0) {
    await Settings.create({});
  }
}

export default Settings; 