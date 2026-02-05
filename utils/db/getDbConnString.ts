
const getConnectionString = () => {
  console.log("Setting up drizzle");
  const connString = process.env.DATABASE_URL;
  if (!connString)
    throw new Error("DATABASE_URL environment variable not provided");
  return connString;
};

export default getConnectionString;
