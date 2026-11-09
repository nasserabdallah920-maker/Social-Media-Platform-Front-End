"use client";

import { useState } from "react";
import ShowImages from "./ShowImages";
import ShowPosts from "./ShowPosts";
import { ImageItem } from "../interfaces/postInterfaces";

export default function FeedPage() {
  const [open, setOpen] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<number>(0);
  const [images, setImages] = useState<ImageItem[]>([]);
  return (
    <>
      {open && (
        <ShowImages
          images={images}
          currentId={currentId}
          onClose={() => setOpen(false)}
        />
      )}

      <ShowPosts
        setOpen={setOpen}
        setCurrentId={setCurrentId}
        setImages={setImages}
      />
    </>
  );
}
