import { ReactNode, createContext, useContext } from "react";
import { IViewModel } from "../model/view_model";
import { useViewModel } from "./use_view_model";

const ViewModelContext = createContext<IViewModel | null>(null);
const useViewModelContext = () => useContext(ViewModelContext);

export function ViewModel({ children }: { children: ReactNode }) {
  const viewModel = useViewModel();

  return (
    <ViewModelContext.Provider value={viewModel}>
      {children}
    </ViewModelContext.Provider>
  );
}

export default useViewModelContext;
