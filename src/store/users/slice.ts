import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
	name: string;
	email: string;
	github: string;
}

export interface userWithId extends User {
	id: number;
}

export const defaultState: userWithId[] = [
	{ id: 1, name: "Pepe", email: "pepe@gmail.com", github: "supepelu" },
	{ id: 2, name: "Jose", email: "Jose@gmail.com", github: "joselito" },
	{ id: 3, name: "Maria", email: "Jose@gmail.com", github: "joselito" },
	{ id: 4, name: "Jose", email: "Jose@gmail.com", github: "joselito" },
];

export const asyncDefaultSate = (): Promise<userWithId[]> =>{
	return new Promise((resolve, reject) =>{
		setTimeout(() =>{
			resolve(defaultState)
		},100)
	})
}

const initialState = () => {
	const persistedState = localStorage.getItem("__redux__state__");
	if (persistedState) {
		return JSON.parse(persistedState).users; // tengo que decir .user porque esto me guardaria todo el storecde todas las slices
	}
	return defaultState;
};

export const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {
		deleteUserbYId: (state, action: PayloadAction<number>) => {
			//El action tiene type y payload
			const id = action.payload;
			return state.filter((user: userWithId) => user.id !== id);
		},
		addUser: (state, action: PayloadAction<User>) => {
			const newId = action.payload;
			const id = crypto.randomUUID();
			return [...state, { id, ...newId }];
		},
		addPermaUser: (state) => {
			const permaUser = 	{ id: 4, name: "Jose", email: "Jose@gmail.com", github: "joselito" }
			return [...state, {...permaUser, id: crypto.randomUUID()}]

		},
		/* OBJETIVO: 
	    	1-) ACTUALIZO LA UI CORRECTAMENTE
			2-) VOY HACIENDO LA LLAMADA A LA BD ASINCRONA
			3-) SI HA HABIDO UN ERROR HAGO UN ROLLBACK PARA DESACTUALIZAR LA UI 
		*/
		rollBackUser: (state, action: PayloadAction<userWithId>) => {
			const isUserAlreadyDefined = state.find((user: userWithId )=> user.id === action.payload.id) //Me aseguro de que no este
			if(!isUserAlreadyDefined){
				return [...state, action.payload]
			}
			
		}
	},
});

export default usersSlice.reducer;

export const { deleteUserbYId, addUser, rollBackUser, addPermaUser } = usersSlice.actions;
