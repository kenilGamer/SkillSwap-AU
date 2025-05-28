import { Schema, model, models, Types } from 'mongoose';
import crypto from 'crypto';

interface IVerificationToken {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const verificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomBytes(32).toString('hex'),
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  },
});

// Clean up expired tokens
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const VerificationToken = models.VerificationToken || model<IVerificationToken>('VerificationToken', verificationSchema);

export default VerificationToken; 