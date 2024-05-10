import { Button } from '@tremor/react';
import { Toaster } from "sonner";
import "./App.css";
import { CreateNewUser } from "./components/CreateNewUser";
import { ListOfUsers } from "./components/ListOfUsers";
import { useAppDispatch } from "./hooks/useStore";
import { asyncDefaultSate } from "./store/users/slice";

function App() {
	const dispatch = useAppDispatch()

	const handlePermaUser = async () => {
		//dispatch(addPermaUser())
		await asyncDefaultSate()
			.then(data => {
				console.log(data)
				console.log('aqui')
			})
			.catch(error =>{
				console.log(error)
				console.log('erooor')
			})
	}
	return (
		<>
			<Button className="mb-2" onClick={handlePermaUser}> Add Perma User (no sense)</Button>
			<ListOfUsers />
			<CreateNewUser />
			<Toaster richColors />
		</>
	);
}

export default App;
