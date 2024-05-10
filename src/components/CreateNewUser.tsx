import { Badge, Button, Card, TextInput, Title } from "@tremor/react";
import { useUserAction } from "../hooks/useUsersActions";
import { useState } from "react";

export function CreateNewUser() {
	const { addNewUser } = useUserAction();
	const [result, setResult] = useState<'ok' | 'ko' | null >(null)

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setResult(null)

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const github = formData.get("github") as string;

		 if(!name || !github || !email){ //Validacion 
			return setResult('ko')
		}

		addNewUser({ name, email, github });
		setResult('ok')
		form.reset()
	};
	return (
		<Card style={{ marginTop: "16px" }}>
			<Title>Create new User</Title>

			<form onSubmit={handleSubmit}>
				<TextInput name="name" id="name" placeholder="Aquí el nombre" />
				<TextInput name="email" placeholder="Aquí el email" />
				<TextInput name="github" placeholder="Aquí el usuario de github" />
				<div style={{ marginTop: "16px" }}>
					<Button type="submit"> Crear Usuaruio </Button>
					<span>
						{result === 'ok' && <Badge color='green'>Guardado correctamente</Badge> }
						{result === 'ko' && <Badge color='red' >Ha ocurrido un error</Badge> }
					</span>
				</div>
			</form>
		</Card>
	);
}
