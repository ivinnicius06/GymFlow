export type MainTabParamList = {
  HomeTab: undefined;
  StudentsTab: undefined;
  ExercisesTab: undefined;
  WorkoutsTab: undefined;
  ProgressTab: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends MainTabParamList {}
  }
}
