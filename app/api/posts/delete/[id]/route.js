import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { verifyToken } from "@/lib/verifyToken";

export async function DELETE(req, context) {
  try {
    await connectDB();

    const user = await verifyToken(req);
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Next.js latest fix (params async)
    const { id } = await context.params;
    const postId = id;

    const post = await Post.findById(postId);

    if (!post) {
      return Response.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.user.toString() !== user.id) {
      return Response.json({ message: "Not allowed" }, { status: 403 });
    }

    await Post.findByIdAndDelete(postId);

    return Response.json({ success: true, message: "Post deleted ✅" }, { status: 200 });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
