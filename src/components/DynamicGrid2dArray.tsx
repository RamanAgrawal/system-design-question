import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface DynamicGrid2dArrayProps {
  // Define any props if needed in the future
}

const DynamicGrid2dArray: FC<DynamicGrid2dArrayProps> = () => {
  // State to keep track of selected boxes
  const [selected, setSelected] = useState<Set<number>>(new Set<number>());
  // State to handle the unloading process
  const [unloading, setUnloading] = useState<boolean>(false);
  // Ref to store the timeout ID
  const timeRef = useRef<number | null>(null);
  // Sample 2D array data
  const data = [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
  ];
  // Flatten the 2D array for easier manipulation
  const col = data[0].length; // Number of columns
  const arr = useMemo(() => data.flat(), [data]);
  // Calculate the number of visible boxes (value 1)
  const countVisibleBoxes = useMemo(
    () =>
      arr.reduce((acc, box) => {
        if (box === 1) {
          acc += 1;
        }
        return acc;
      }, 0),
    [arr]
  );

  // Handle box click events
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { target } = e;

    if (!(target instanceof HTMLDivElement)) {
      return;
    }

    const index = Number(target.dataset.index);
    const status = target.dataset.status;

    if (isNaN(index) || status === "hidden" || unloading) {
      return;
    }
    setSelected((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.add(index);
      return updatedSet;
    });
  };

  // Unload the selected boxes sequentially
  const unload = useCallback(() => {
    setUnloading(true);
    const keys = Array.from(selected.keys());
    const removeNext = () => {
      if (keys.length) {
        const currentKey = keys.shift() as number;
        setSelected((prev) => {
          const updatedKeys = new Set(prev);
          updatedKeys.delete(currentKey);
          return updatedKeys;
        });
        timeRef.current = setTimeout(removeNext, 500);
      } else {
        setUnloading(false);
        if (timeRef.current) {
          clearTimeout(timeRef.current);
        }
      }
    };
    timeRef.current = setTimeout(removeNext, 100);
  }, [selected]);

  // Effect to trigger unloading when all visible boxes are selected
  useEffect(() => {
    if (selected.size === countVisibleBoxes) {
      unload();
    }
  }, [selected, countVisibleBoxes, unload]);

  return (
    <div
      className={`grid grid-cols-${col} size-96 gap-3 `}
      onClick={handleClick}
    >
      {arr.map((item, i) => (
        <div
          className={`${item === 1 ? "border" : ""} size-full ${
            selected.has(i) ? "bg-red-500" : ""
          }`}
          key={i}
          data-index={i}
          data-status={item ? "visible" : "hidden"}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default DynamicGrid2dArray;
