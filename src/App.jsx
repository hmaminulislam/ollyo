import React, { useMemo, useState } from "react";
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
import './App.css'

// gallery json dummy data
let data = [
  { img: "https://i.ibb.co/M6jnfdH/image-11.jpg", id: "1" },
  { img: "https://i.ibb.co/Fb3Lkbd/image-10.jpg", id: "2" },
  { img: "https://i.ibb.co/qB2jxjn/image-9.webp", id: "3" },
  { img: "https://i.ibb.co/M7vTjXj/image-8.webp", id: "4" },
  { img: "https://i.ibb.co/1GjK3jx/image-7.webp", id: "5" },
  { img: "https://i.ibb.co/j60RSx4/image-6.webp", id: "6" },
  { img: "https://i.ibb.co/cc06Yrm/image-5.webp", id: "7" },
  { img: "https://i.ibb.co/tmPrpP6/image-4.webp", id: "8" },
  { img: "https://i.ibb.co/ZmZMmLz/image-3.webp", id: "9" },
  { img: "https://i.ibb.co/0XWTN5z/image-2.webp", id: "10" },
  { img: "https://i.ibb.co/4WGpmLh/image-1.webp", id: "11" },
];
function App() {
  const [activeId, setActiveId] = useState(null);
  const [images, setImages] = useState(data);
  const [activeDrag, setActiveDrag] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const [dataRemove, setDataRemove] = useState(false);
  const itemIds = useMemo(() => images.map((item) => item.img), [images]);
  // dnd kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  //  handle drag start
  function handleDragStart(event) {
    setActiveDrag(true);
    const { active } = event;
    setActiveId(active.id);
  }

  // handle drag end
  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveDrag(false);
    if (active.id !== over.id) {
      setImages((images) => {
        const oldIndex = images.findIndex((item) => item.img === active.id);
        const newIndex = images.findIndex((item) => item.img === over.id);

        return arrayMove(images, oldIndex, newIndex);
      });
    } else {
      return;
    }
    setActiveId(null);
  }

  // handle image upload
  const handleUploadImg = (event) => {
    const imgUrl = URL.createObjectURL(event.target.files[0]);
    const id = (images.length + 1).toString();
    const newData = { img: imgUrl, id: id };
    setImages([...images, newData]);
  }

  // handle delete
  const handleDelete = () => {
    setSelectedData(false);
    const currentData = data.filter((s) => {
      return !selectedData.includes(s.id);
    });
    setImages(currentData);
    setDataRemove(true);
  }
  
  return (
    <div className="container">
      <div className="gallery-top">
        {selectedData?.length ? (
          <div className="selecte-title-wrapper">
            <input
              type="checkbox"
              className="check-input"
              checked={true}
              readOnly
            />
            <h3 className="gallery-title">
              {selectedData?.length} Files Selected
            </h3>
          </div>
        ) : (
          <h3 className="gallery-title">Gallery</h3>
        )}
        {selectedData?.length ? (
          <button onClick={handleDelete} className="delete-btn">
            Delete Files
          </button>
        ) : (
          ""
        )}
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <form>
          <div className="content">
            <SortableContext items={itemIds} strategy={rectSortingStrategy}>
              {images.map((item) => (
                <SortableItem
                  key={item.id}
                  id={item.img}
                  value={item.id}
                  activeDrag={activeDrag}
                  setSelectedData={setSelectedData}
                  dataRemove={dataRemove}
                  setDataRemove={setDataRemove}
                />
              ))}
            </SortableContext>
            <div className="add-img-wrapper">
              <input
                className="file-input"
                onChange={handleUploadImg}
                accept="image/*"
                type="file"
              />
              <img
                className="upload-img-icon"
                src="https://i.ibb.co/CHWyx6r/image-icon.png"
                alt=""
              />
              <h4 className="add-img-title">Add Images</h4>
            </div>
          </div>
        </form>
      </DndContext>
    </div>
  );
}

export default App;
