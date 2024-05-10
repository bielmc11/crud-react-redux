import { addUser, deleteUserbYId, type User } from "../store/users/slice";
import { useAppDispatch } from "./useStore";

//Este hook l uso para las acciones del Dispatch
export const useUserAction = () => {
	const dispatch = useAppDispatch();

	const handleDeleteUsers = ({ id }: { id: number }) => {
		dispatch(deleteUserbYId(id));
	};

	const addNewUser = ({ name, email, github } : User) => {
		dispatch(addUser({ name, email, github }));
	};

	return { handleDeleteUsers, addNewUser };
};
