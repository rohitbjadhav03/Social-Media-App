import jwt from "jsonwebtoken";

export async function verifyToken(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded; 
  } catch (err) {
    console.log("Token verify error:", err);
    return null;
  }
}
