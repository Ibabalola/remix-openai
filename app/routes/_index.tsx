import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import { addUser, findUserByEmailPassword } from "~/services/user";
import { User } from "~/types/user";

type ActionData = {
  error?: string;
  user?: User;
}

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async ({ request }: { request: Request }) => {

  return Response.json({});
}

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return Response.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password
  }

  const userExists = findUserByEmailPassword(email, password);

  const user: User = userExists ?? newUser;

  if (!userExists) {
    addUser(user);
  }

  return Response.json([user], { status: 200 });
}

export default function Index() {
  const { error } = useActionData<ActionData>() ?? {};
  return (
    <div className="centered-form">
      <div className="form-container">
        <h1 className="title">Login</h1>
        {error && <div className="error-message"><strong>Error! </strong>{error}</div>}
        <Form method="post">
          <div className="input-container">
            <label htmlFor="name" className="input-label">Name</label>
            <input type="text" id="name" className="input-field" />
          </div>

          <div className="input-container">
            <label htmlFor="email" className="input-label">Email</label>
            <input type="email" id="email" className="input-field" autoComplete="username"/>
          </div>

          <div className="input-container">
            <label htmlFor="password" className="input-label">Password</label>
            <input type="password" id="password" className="input-field" autoComplete="current-password"/>
          </div>

          <button className="login-button" type="submit">Login</button>
        </Form>
      </div>
    </div>
  );
}
