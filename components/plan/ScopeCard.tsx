import {Button} from "@/components/ui/button";
import React from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


export interface Subject {
    id: string;
    name: string;
    grades: {
        id: string;
        name: string;
        units: Unit[];
    }[];
    onUnitsReorder?: (gradeId: string, newUnits: Unit[]) => void;
}

interface Unit {
    id: string;
    name: string;
    duration: string;
}

interface SortableUnitProps {
    id: string;
    name: string;
    duration: string;
}

const SortableUnit = ({ id, name, duration }: SortableUnitProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-move"
        >
            <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-500">{duration}</p>
            </div>
            <Button
                variant="outline"
                size="sm"
                // onClick={() => navigateTo('unit-plan-view', unit)}
            >
                See scope
            </Button>
        </div>
    );
};

export const ScopeCard = (subject: Subject) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent, gradeId: string) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const grade = subject.grades.find(g => g.id === gradeId);
            if (!grade) return;

            const oldIndex = grade.units.findIndex(unit => unit.id === active.id);
            const newIndex = grade.units.findIndex(unit => unit.id === over.id);

            const newUnits = arrayMove(grade.units, oldIndex, newIndex);
            grade.units = newUnits;

            if (subject.onUnitsReorder) {
                subject.onUnitsReorder(gradeId, newUnits);
            }
        }
    };

    return (
        <div key={subject.id} className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-xl font-semibold mb-4">{subject.name}</h3>
            <div className="space-y-6">
                {subject.grades.map((grade) => (
                    <div key={grade.id} className="border p-4 rounded">
                        <h4 className="font-medium mb-2">Grade: {grade.name}</h4>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(event) => handleDragEnd(event, grade.id)}
                        >
                            <SortableContext
                                items={grade.units.map(unit => unit.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {grade.units.map((unit) => (
                                        <SortableUnit
                                            key={unit.id}
                                            id={unit.id}
                                            name={unit.name}
                                            duration={unit.duration}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                ))}
            </div>
        </div>
    );
};
