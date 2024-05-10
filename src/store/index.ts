import {
	configureStore,
	type Middleware,
} from "@reduxjs/toolkit";
import { toast } from "sonner";
import usersReducer, { rollBackUser, userWithId } from "./users/slice";
//En la 1 guardare TODO, el estado, los reducers, las acciones...

interface myAction {
	type: string
}

const persistanceLocalSorageMiddleware: Middleware =
	(store) => (next) => (action) => {

		const { type }  = action as any
		console.log(action)
		next(action);
		localStorage.setItem("__redux__state__", JSON.stringify(store.getState()));
		if (type === 'users/deleteUserbYId'){
			// Lo comento en vez de hacerlo porque he puesto el mismo toast en el middleware asincrono anterior
			// toast.error('Usuario eliminado')
		}
		if(type === 'users/addUser'){
			toast.success('Usuario Creado')
		}
	};



const syncWithDatabase: Middleware = (store) => (next) => (action : any) => {
	const {type, payload} = action 
	const previousState = store.getState() as RootState

	next(action);

	if(type === 'users/deleteUserbYId'){
		const userIdToRemove  = payload //El id del usuario a eliminar
		const userToRemove = previousState.users.find((user: userWithId ) => user.id === userIdToRemove) //Busco si estaba en la lista anterior
		console.log('El usuario a aliminar es',userToRemove)
			fetch(`https://jsonplaceholder.typicode.com/users/${userIdToRemove}`,{method : 'DELETE'}) //Aqui lo elimino EN LA bd
				.then(res => {
					if(res.ok){
						toast.success('Usuario eliminado correctamente');
						return
					}
					throw new Error('Error al eliminar el usuario')
					
				})
				.catch(error => { //Si no he podido eliminar al usuario de la BD tengo que devolverlo a la lista de la UI
					toast.error('El usuario no se ha podido eliminar')
					if(userToRemove){
						console.log('entreeeee')
						store.dispatch(rollBackUser(userToRemove)) //Llamo al metodo rollBack para devolver al usuario
					}
				})
	}
	
};

/* QUE ESTA PASADNO EN MI ROLLBACK?
	1-) Desde la slice de users controlo lo UI, pero no la BD 
	2-)Esto lo hago para que sea una carga optimista
	3-)La eliminacion real de la BD se hace en el middlewere syncWithDatabase
	4-)Si me fijo el usuario se borra de la UI pero tarda mas en eliminarse de la BD
	5-) Por eso el middleware si ha hay un error al eliminarlo llamara al metodo rollback de la slice
	6-) La slice lo que hace es recuperar el usuario que ha eliminado de la lista de la UI pero sigue en la BD
 */

export const store = configureStore({
	reducer: {
		users: usersReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().prepend(
			persistanceLocalSorageMiddleware,
			syncWithDatabase,
		),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
