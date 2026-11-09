"use client";
import { Comment, ImageItem, Post } from "../../feed/interfaces/postInterfaces";

import ShowImages from "../../feed/pages/ShowImages";

import { useState, useRef, useEffect } from "react";

import { usePost } from "../hooks/usePost";
import ConfirmationModal from "@/components/ConfirmationModal";
import EditPostModal from "./EditPostModal";
import PostInfo from "./PostInfo";

export default function PostCard({
  post,
  comments,
}: {
  post: Post;
  comments: Comment[];
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<number>(0);
  const [images, setImages] = useState<ImageItem[]>(post.images || []);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [currentImages, setCurrentImages] = useState<ImageItem[]>(
    post.images || [],
  );

  const menuRef = useRef<HTMLDivElement>(null);
  const { deletePost } = usePost();


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteConfirm = () => {
    deletePost.mutate(post.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-800">
      {open && (
        <ShowImages
          currentId={currentId}
          onClose={() => setOpen(false)}
          images={images}
        />
      )}
      <PostInfo
        setImages={setImages}
        setCurrentId={setCurrentId}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        setOpen={setOpen}
        setIsMenuOpen={setIsMenuOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        isMenuOpen={isMenuOpen}
        currentImages={currentImages}
        post={post}
        comments={comments}
      />

      {/* Edit Post Modal */}
      <EditPostModal
        post={post}
        setIsMenuOpen={setIsMenuOpen}
        setCurrentImages={setCurrentImages}
        currentImages={currentImages}
        setIsEditModalOpen={setIsEditModalOpen}
        isEditModalOpen={isEditModalOpen}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        handleConfirm={handleDeleteConfirm}
        isPending={deletePost.isPending}
        message="Are you sure you want to delete this post? This action cannot be undone."
        title="Delete Post?"
        isModalOpen={isDeleteModalOpen}
        setIsModalOpen={setIsDeleteModalOpen}
      />
    </div>
  );
}
