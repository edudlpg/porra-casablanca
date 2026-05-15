export type PredictionActionState = {
  type: "idle" | "success" | "error";
  message: string;
  submittedAt: number;
};

export const initialPredictionActionState: PredictionActionState = {
  type: "idle",
  message: "",
  submittedAt: 0,
};
