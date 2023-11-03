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
    "Javascript",
    "Python",
    "Php",
    "Typescript",
    "Java",
    "C++",
    "Ruby",
    "Wordpress",
    "Webflow",
    "Shopify",
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

  //  handle drag start
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
  );
}

export default App;
