import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(req) {
  try {
    await connectDB();

    const user = await verifyToken(req);
    console.log("HEADER TOKEN:", req.headers.get("authorization"));

    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();

    if (!content) {
      return Response.json({ message: "Content required" }, { status: 400 });
    }

    const newPost = await Post.create({
      user: user.id,  // <-- FIX
      content,
    });

    return Response.json({ success: true, post: newPost }, { status: 201 });

  } catch (err) {
    console.log("POST ERROR:", err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
