export const activityType = {
    DONE: "done",
    MESSAGE: "message",
    UPLOAD: "upload",
    EDIT: "edit",
  } as const;
  
  export type ActivityType = typeof activityType[keyof typeof activityType];