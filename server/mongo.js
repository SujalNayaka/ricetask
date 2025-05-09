require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Tarun2:ErHBBKbj21JAUBpu@cluster0.9ufjebs.mongodb.net/destinations?retryWrites=true&w=majority&appName=Cluster0';

const connection = mongoose.createConnection(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 30000
});

connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

connection.on('disconnected', () => {
  console.log('ℹ️ MongoDB disconnected');
});

// Schema definitions
const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
};

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, match: /^[0-9]{10,15}$/ },
  mail: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
  },
  role: { type: String, enum: ['user', 'service', 'transport'], required: true },
  password: { type: String, required: true, select: false },
  District: { type: String, required: true },
  address: { type: String, required: true }
}, schemaOptions);

// Add indexes for better query performance
userSchema.index({ username: 1 });
userSchema.index({ mail: 1 });

// Pre-save hook for password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Model methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export models
module.exports = {
  connection,
  User: connection.model('User', userSchema),
  // Other models would be defined similarly
  ServiceProvider: connection.model('ServiceProvider', serviceProviderSchema),
  TransportProvider: connection.model('TransportProvider', transportProviderSchema)
};