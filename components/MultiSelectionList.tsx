"use client";

import React, { useEffect, useState } from "react";

export default function MultiSelectList({
  selectedItems,
  allItems,
  itemsLabel,
  updateSelectedItems,
  itemsAreLoading,
  allShouldBeSelected,
  withSheckbox,
}: {
  selectedItems: any[];
  allItems: any[];
  itemsLabel?: string;
  updateSelectedItems: Function;
  itemsAreLoading: boolean;
  allShouldBeSelected: boolean;
  withSheckbox: boolean;
}) {
  // State to keep track of checkboxes
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(allShouldBeSelected); // Select All is also checked by default

  // Handle individual item checkbox change
  const handleItemChange = (item: string) => {
    const updatedItems: Record<string, boolean> = {
      ...checkedItems,
      [item]: !checkedItems[item],
    };
    setCheckedItems(updatedItems);

    // Update Select All state if any item is unchecked
    const allChecked = Object.values(updatedItems).every(Boolean);
    setSelectAll(allChecked);

    // Update The POSTing Items
    const updatingData: string[] = Object.keys(updatedItems).filter(
      (key) => updatedItems[key as keyof typeof updatedItems] === true
    );
    updateSelectedItems(updatingData);
  };

  // Handle Select All change
  const handleSelectAllChange = () => {
    const newCheckedState = !selectAll;
    const updatedItems = Object.fromEntries(
      allItems?.map((item) => [item, newCheckedState])
    );

    setCheckedItems(updatedItems);
    setSelectAll(newCheckedState);

    // Update The POSTing Items
    const updatingData: string[] = Object.keys(updatedItems).filter(
      (key) => updatedItems[key as keyof typeof updatedItems] === true
    );
    updateSelectedItems(updatingData);
  };

  useEffect(() => {
    if (allItems?.length > 1) {
      const updatedItems = Object.fromEntries(
        allItems?.map((item) => [item, selectAll])
      ); // All inputs checked by default

      setCheckedItems(updatedItems);
    }
  }, [allItems]);

  return (
    <>
      {!itemsAreLoading ? (
        <div className="flex flex-col gap-2">
          {/* Select All Checkbox */}
          <label className="flex items-center space-x-2">
            {withSheckbox ? (
              <>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                <span>Select All</span>
              </>
            ) : (
              ""
            )}
          </label>

          <div className="flex gap-2 flex-wrap">
            {/* Item Checkboxes */}
            {allItems?.map((item, index) => (
              <label key={index} className="flex items-center space-x-2">
                {withSheckbox ? (
                  <input
                    type="checkbox"
                    checked={checkedItems[item]}
                    onChange={() => handleItemChange(item)}
                  />
                ) : (
                  ""
                )}

                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <label className="text-muted-foreground">Loading data ...</label>
        </div>
      )}
    </>
  );
}
