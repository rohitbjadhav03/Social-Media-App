import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User"; // ✅ ADD THIS

export async function GET() {
  try {
    await connectDB();

    const posts = await Post.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return Response.json({ success: true, posts }, { status: 200 });
  } catch (err) {
    console.log("GET POSTS ERROR:", err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
