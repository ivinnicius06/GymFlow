export type MainTabParamList = {
  HomeTab: undefined;
  StudentsTab: undefined;
  ExercisesTab: { openNewExercise?: boolean } | undefined;
  WorkoutsTab: { workoutId?: string; workoutTitle?: string } | undefined;
  ProgressTab: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainTabParamList {}
  }
}
