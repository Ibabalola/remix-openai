import { redirect } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react";
import { MouseEvent, MouseEventHandler } from "react";
import { deleteUser, findUser } from "~/services/user"
import { User } from "~/types/user";

export const loader = async ({ params }: { params: { id: string } }) => {
  const user = findUser(params.id);
  if (!user) {
    return redirect("/");
  }

  return Response.json(user, {
    status: 200,
  })
}

export const action = async ({ params, request } : { params: { id: string }, request: Request }) => {
  const form = await request.formData();
  const action = (form.get("_action") as string);

  if (action === 'deleteUser') {
    deleteUser(params.id);
  }

  if (action === 'deleteUser' || action === 'logout') {
    return redirect("/")
  }

  throw Error("action unknown");
}

const Profile = () => {
  const user = useLoaderData<User>();

  const handleClientSideLogout: MouseEventHandler<HTMLButtonElement> = (event: MouseEvent<HTMLButtonElement>) => {
    const action = event.currentTarget.value;
    if (action === 'deleteUser' || action === 'logout') {
      localStorage.removeItem('userLogged');
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title"> Welcome, {user.name} </h1>
      <p className="profile-description"> Email: {user.email} </p>
      <div>
        <Form method="post">
          <button 
            className="delete-button" 
            type="submit"
            name="_action"
            value="deleteUser"
            onClick={handleClientSideLogout}>
              Delete Account
          </button>
          <button
            className="logout-button"
            type="submit"
            name="_action"
            value="logout"
            onClick={handleClientSideLogout}>
              Logout
            </button>
        </Form>
      </div>
    </div>
  )
}

export default Profile;