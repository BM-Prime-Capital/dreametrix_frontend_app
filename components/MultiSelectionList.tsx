"use client";

import React, { useEffect, useState } from "react";

const MultiSelectList = React.memo(
  ({
    selectedItems,
    allItems,
    itemsLabel,
    updateSelectedItems,
    itemsAreLoading,
    allShouldBeSelected,
    withSheckbox,
    className,
    alignment,
  }: {
    selectedItems: any[];
    allItems: string[];
    itemsLabel?: string;
    updateSelectedItems: Function;
    itemsAreLoading: boolean;
    allShouldBeSelected: boolean;
    withSheckbox: boolean;
    className?: string;
    alignment?: string;
  }) => {
    // State to keep track of checkboxes
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
      {}
    );
    const [selectAll, setSelectAll] = useState(allShouldBeSelected); // Select All is also checked by default
    console.log("checkedItems => ", checkedItems);
    // Handle individual item checkbox change
    const handleItemChange = (item: string) => {
      console.log("handleItemChange => ", item);
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
          <div className={"flex flex-col gap-4"}>
            {/* Select All Checkbox */}
            <label className="flex items-center space-x-2">
              {withSheckbox ? (
                <>
                  <input
                    className="hidden"
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                  <span className="flex p-[2px] border-[2px] border-[#ff69b4] w-[20px] h-[20px] rounded-sm">
                    <span
                      className={`flex-1 rounded-xs ${
                        selectAll ? "bg-[#ff69b4]" : ""
                      }`}
                    >
                      {" "}
                    </span>
                  </span>
                  <span>Select All</span>
                </>
              ) : (
                ""
              )}
            </label>

            <div
              className={`flex flex-${
                alignment ? alignment : "row"
              } gap-4 flex-wrap`}
            >
              {/* Item Checkboxes */}
              {allItems?.map((item, index) => (
                <label
                  key={index}
                  className={`flex items-center space-x-2 ${className}`}
                >
                  {withSheckbox ? (
                    <>
                      <input
                        className="hidden"
                        type="checkbox"
                        checked={checkedItems[item]}
                        onChange={() => handleItemChange(item)}
                      />
                      <span className="flex p-[2px] border-[2px] border-[#ff69b4] w-[20px] h-[20px] rounded-sm">
                        <span
                          className={`flex-1 rounded-xs ${
                            checkedItems[item] ? "bg-[#ff69b4]" : ""
                          }`}
                        >
                          {" "}
                        </span>
                      </span>
                    </>
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
);

export default MultiSelectList;
