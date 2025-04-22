import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { addUser, findUserByEmailPassword } from "~/services/user";
import { User } from "~/types/user";

type ActionData = {
  error?: string;
  user?: User;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Open AI Remix App" },
    { name: "description", content: "Welcome to a Remix Open AI Application!" },
  ];
};

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

  return Response.json({ user }, { status: 200 });
}

const Index = () => {
  const { error, user } = useActionData<ActionData>() ?? {};
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('userLogged');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      location.pathname = `/profile/${user.id}`;
    }

    if (user) {
      localStorage.setItem('userLogged', JSON.stringify(user));
      navigate(`/profile/${user.id}`);
    }
  }, [user, navigate]);

  return (
    <div className="centered-form">
      <div className="form-container">
        <h1 className="title">Login</h1>
        {error && <div className="error-message"><strong>Error! </strong>{error}</div>}
        <Form method="post">
          <div className="input-container">
            <label htmlFor="name" className="input-label">Name</label>
            <input type="text" id="name" name="name" className="input-field" />
          </div>
          <div className="input-container">
            <label htmlFor="email" className="input-label">Email</label>
            <input type="email" id="email" name="email" className="input-field" autoComplete="username"/>
          </div>
          <div className="input-container">
            <label htmlFor="password" className="input-label">Password</label>
            <input type="password" id="password" name="password" className="input-field" autoComplete="current-password"/>
          </div>
          <button className="login-button" type="submit">Login</button>
        </Form>
      </div>
    </div>
  );
}

export default Index;