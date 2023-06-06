import { SOLID_IDENTITY_PROVIDER } from '..';

const registerPod = async ({ email, password, confirmPassword }, oidcProvider = SOLID_IDENTITY_PROVIDER ) => { 
  const [podName] = email.split('@');
  
  const oidcRegistrationPath = `${oidcProvider}idp/register/`;

  const body = {
    email,
    password,
    confirmPassword,
    podName,
    createWebId: true,
    createPod: true,
    rootPod: false,
    register: true
  };

  const response = await fetch(oidcRegistrationPath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  });
  return response.json();
}

export default registerPod