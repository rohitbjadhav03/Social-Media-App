import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(req) {
  try {
    await connectDB();

    const user = await verifyToken(req);

    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();

    const newPost = await Post.create({
      user: user.id, // ✅ token se id aa rahi hai
      content,
    });

    return Response.json({ success: true, post: newPost }, { status: 201 });
  } catch (err) {
    console.log("POST ERROR:", err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
