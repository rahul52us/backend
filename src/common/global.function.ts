import * as jwt from "jsonwebtoken";
interface tokenDetails {
  userId: string;
}
export const generateToken = async (userId: tokenDetails): Promise<string> => {
  const tokens = jwt.sign({ userId }, process.env.SECRET_KEY);
  return tokens;
};