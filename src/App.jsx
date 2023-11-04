import React, { useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./components/SortableItem";
import "./App.css";

function App() {
  const [activeId, setActiveId] = useState(null);

  // data
  const [languages, setLanguages] = useState([
    "https://i.ibb.co/4WGpmLh/image-1.webp",
    "https://i.ibb.co/0XWTN5z/image-2.webp",
    "https://i.ibb.co/ZmZMmLz/image-3.webp",
    "https://i.ibb.co/tmPrpP6/image-4.webp",
    "https://i.ibb.co/cc06Yrm/image-5.webp",
    "https://i.ibb.co/j60RSx4/image-6.webp",
    "https://i.ibb.co/1GjK3jx/image-7.webp",
    "https://i.ibb.co/M7vTjXj/image-8.webp",
    "https://i.ibb.co/qB2jxjn/image-9.webp",
    "https://i.ibb.co/Fb3Lkbd/image-10.jpg",
    "https://i.ibb.co/M6jnfdH/image-11.jpg",
  ]);

  // dnd
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  //  handle drag start
  function handleDragStart(event) {
    const { active } = event;
    setActiveId(active.id);
  }

  // handle drag end
  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setLanguages((languages) => {
        const oldIndex = languages.indexOf(active.id);
        const newIndex = languages.indexOf(over.id);

        return arrayMove(languages, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }

  return (
    <div className="container">
      <div className="gallery-top">
        <h3 className="gallery-title">Gallery</h3>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="content">
          <SortableContext items={languages} strategy={rectSortingStrategy}>
            {languages.map((language) => (
              <SortableItem key={language} id={language} />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}

export default App;
