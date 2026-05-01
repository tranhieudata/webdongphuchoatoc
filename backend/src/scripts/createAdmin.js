import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

dotenv.config();

const DEFAULT_MONGO_URI = 'mongodb://localhost:27017/webdongphuchoatoc';

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;

    const key = token.slice(2);
    const next = argv[i + 1];

    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    i += 1;
  }

  return args;
}

function showUsage() {
  console.log('Usage: npm run create:admin -- --username <username> --password <password>');
  console.log('Example: npm run create:admin -- --username admin --password "StrongPass123!"');
}

async function run() {
  const args = parseArgs(process.argv.slice(2));

  const username = args.username || process.env.ADMIN_USERNAME;
  const password = args.password || process.env.ADMIN_PASSWORD;
  const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO_URI;

  if (!username || !password) {
    console.error('Missing required args: --username and --password');
    showUsage();
    process.exitCode = 1;
    return;
  }

  try {
    await mongoose.connect(mongoUri);

    const existing = await User.findOne({ username });

    if (existing) {
      existing.role = 'admin';
      existing.password = password;
      existing.updated_at = new Date();
      await existing.save();
      console.log(`Updated existing user "${username}" to admin successfully.`);
    } else {
      const admin = new User({
        username,
        password,
        role: 'admin',
      });

      await admin.save();
      console.log(`Created admin user "${username}" successfully.`);
    }
  } catch (error) {
    console.error('Failed to create admin:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

run();
