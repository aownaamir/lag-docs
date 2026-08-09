import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../lib/models/User";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

async function seed() {
  await mongoose.connect(MONGODB_URI);

  await User.deleteMany({});

  const users = await User.insertMany([
    {
      name: "Alice",
      email: "alice@lag.dev",
    },
    {
      name: "Bob",
      email: "bob@lag.dev",
    },
    {
      name: "Charlie",
      email: "charlie@lag.dev",
    },
  ]);

  console.log(`Seeded ${users.length} users`);

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
