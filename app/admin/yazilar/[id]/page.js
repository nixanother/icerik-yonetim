import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import PostForm from "../PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const rows = await db.select("posts", `select=*&id=eq.${numericId}&limit=1`);
  const post = rows[0];
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-indigo-900">Makaleyi Düzenle</h1>
      <PostForm post={post} />
    </div>
  );
}
