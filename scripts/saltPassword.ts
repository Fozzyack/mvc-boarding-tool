import bcrypt from "bcrypt";

const password = process.argv[2] || "password123";
const saltRounds = 10;

const hashPassword = async () => {
   return await bcrypt.hash(password, saltRounds); 
}
const compareHash = async (hash: string, pass: string) => {
    return await bcrypt.compare(pass, hash);
}

async function main() {
    const hash = await hashPassword();
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);

    console.log("Example Comparisons:")
    console.log("Comparing Hash and Password ( gen hash:", hash, "password:", password, ")", await compareHash(hash, password));
    console.log("Comparing Hash and Password ( gen hash:", hash, "password:", "r4ndP4ssW0rd )", await compareHash(hash, "r4ndP4ssW0rd"));

}

main().catch(console.error);
