export type ResultActionState = {
  type: "idle" | "success" | "error";
  message: string;
  submittedAt: number;
};

export const initialResultActionState: ResultActionState = {
  type: "idle",
  message: "",
  submittedAt: 0,
};
