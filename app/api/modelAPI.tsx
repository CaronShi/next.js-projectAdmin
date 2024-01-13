


// Define the base URL for your API
// Create an Axios instance with custom configurations

//SERVER SIDE RENDERING
//Dynamic Rendering from the server, no cache, real time data
// res = await fetch('https://jsonplaceholder.typicode.com/users', {cache: "no-store"})
//STATIC SITE GENERATION, cache
// res = await fetch('https://jsonplaceholder.typicode.com/users')
//INCREMENTAL STATIC REGENERATION, 10 seconds refresh 
// res = await fetch('https://jsonplaceholder.typicode.com/users',{next: {revalidate: 10}})
// Define your API functions

var token = process.env.NEXT_PUBLIC_REACT_APP_TOKEN

export const ModelsAPI = {
  async createUserModels(modelData: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/model/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(modelData),
    });

    return response;
  },
  async GetModelsInOrgByUpdateTime(org_id: any) {

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/model/${org_id}/by-update`, {//https://jsonplaceholder.typicode.com/users
        headers: {
          'Cache-Control': 'no-store',
          'Authorization': `Bearer ${token}`, // Include your token here
        },
      })
      const res = await response.json()
      //console.log(res, org_id);
      return res

    } catch (error) {
      console.error('GetModelsInOrgByUpdateTime Error fetching users:', error)

      return new Response("GetModelsInOrgByUpdateTime failed");
    }
  },
  async checkUserAccessToModel(model_id: string, org_id: any) {
    "http://localhost:3000/user_model/view-access"

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/user_model/view-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Authorization': `Bearer ${token}`, // Include your token here
        },
        body: JSON.stringify({ modelId: model_id, orgId: org_id })
      })

      const role = await response.text();

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      if (role === 'no access') {
        return "non-viewer"; // Return false when access is denied
      } else {
        return role; // Return the actual role when access is granted
      }
    } catch (error) {
      console.error('checkUserAccessToModel Error fetching data:', error);
      return []
    }
  },
  async deleteUserModelsByModelId(model_id: string, org_id: any) {
    " http://localhost:3000/:model_id/:org_id"
    const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/model/${model_id}/${org_id}`, {
      method: 'DELETE',
      headers: {
        'Cache-Control': 'no-store',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response;
  },
  async getViewersInOrg(org_id: any) {
    // "http://localhost:3000/user_org/viewers/:org_id" Get all users in an org 
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/user_org/viewers/${org_id}`, {//https://jsonplaceholder.typicode.com/users
        headers: {//`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/user_org/viewers/${org_id}`
          'Cache-Control': 'no-store',
          'Authorization': `Bearer ${token}`, // Include your token here
        },
      })
      const res = await response.json()
      //console.log("modelAPI getViewersInOrg", org_id, res);
      return res

    } catch (error) {
      console.error('GetModelsInOrgByUpdateTime Error fetching users:', error)
      return new Response("GetModelsInOrgByUpdateTime failed");
    }
  },
  async getOwnerInOrg(org_id: any) {
    // "http://localhost:3000/user_org/viewers/:org_id" Get all users in an org 
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/user_org/owners/${org_id}`, {//https://jsonplaceholder.typicode.com/users
        headers: {//`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/user_org/viewers/${org_id}`
          'Cache-Control': 'no-store',
          'Authorization': `Bearer ${token}`, // Include your token here
        },
      })
      const userid = "82a7ddfc-bbaa-483f-b96b-ff74b52ef2ff"
      const res = await response.json()
      if (res === userid) {
        return true
      }
      else return false

    } catch (error) {
      console.error('GetModelsInOrgByUpdateTime Error fetching users:', error)
      return new Response("GetModelsInOrgByUpdateTime failed");
    }
  },
  async grantModelPermissionsToViewersInOrg(usersIdinput: string[], model_id: any, org_id: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/user_model/grant-permissions/${model_id}/${org_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include your token here
      },
      body: JSON.stringify({ userIds: usersIdinput })
    })
    //console.log("grantModelPermissionsToViewersInOrg response", JSON.stringify({ userIds: usersIdinput }))

    if (!response.ok) {

      throw new Error('grantModelPermissionsToViewersInOrg was not ok');
    } else {
      console.log("grantModelPermissionsToViewersInOrg was ok")
    }

  },
  async revokeModelPermissionsToViewersInOrg(usersIdinput: string[], model_id: any, org_id: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/user_model/revoke-permissions/${model_id}/${org_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include your token here
      },
      body: JSON.stringify({ userIds: usersIdinput })
    })
    //console.log("grantModelPermissionsToViewersInOrg response", JSON.stringify({ userIds: usersIdinput }))

    if (!response.ok) {

      throw new Error('grantModelPermissionsToViewersInOrg was not ok');
    } else {
      console.log("grantModelPermissionsToViewersInOrg was ok")
    }

  },
  async getModelById(model_id: any, org_id: any) {
    //http://localhost:3000/model/d406f09f-0c08-41a4-b373-78d3d4d9161a/36f0913c-9f37-41fe-99a0-85acb2324b39
    //
    try {
      org_id = process.env.NEXT_PUBLIC_REACT_APP_ORG_ID
      const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/model/${model_id}/${org_id}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Authorization': `Bearer ${token}`, // Include your token here
        },
      })
      const res = await response.json()
      //console.log("getModelById res", res);
      return res

    } catch (error) {
      console.error('getModelById Error fetching users:', error)

      return new Response("getModelById failed");
    }

  },
  async updateModelById(modelData: any, model_id: any, org_id: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/model/${model_id}/${org_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(modelData),
    });
    return response;
  },
  async getOrgViewersWithModelPermission(model_id: any, org_id: any) {
    //http://localhost:3000/user_model/viewers/:org_id/:model_id

    try {
      org_id = process.env.NEXT_PUBLIC_REACT_APP_ORG_ID
      const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/user_model/viewers/${model_id}/${org_id}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Authorization': `Bearer ${token}`, // Include your token here
        },
      })
      const res = await response.json()
      //console.log("getOrgViewersWithModelPermission res", res);
      return res

    } catch (error) {
      console.error('getOrgViewersWithoutModelPermission Error fetching users:', error)

      return new Response("getOrgViewersWithoutModelPermission failed");
    }
  },
  async getOrgViewersWithoutModelPermission(model_id: any, org_id: any) {
    //http://localhost:3000/user_model/viewers/:org_id/:model_id
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/user_model/non-viewers/${model_id}/${org_id}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Authorization': `Bearer ${token}`, // Include your token here
        },
      })
      const res = await response.json()
      //console.log("getOrgViewersWithoutModelPermission res", res);
      return res

    } catch (error) {
      console.error('getOrgViewersWithoutModelPermission Error fetching users:', error)

      return new Response("getOrgViewersWithoutModelPermission failed");
    }
  },
  async searchModelByName(model_name: string, org_id: any) {
    //http://localhost:3001/model/36f0913c-9f37-41fe-99a0-85acb2324b39?search=b
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/model/${org_id}?search=${model_name}`, {
        headers: {
          'Cache-Control': 'no-store',
          'Authorization': `Bearer ${token}`, // Include your token here
        },
      })
      const res = await response.json()
      return res

    } catch (error) {
      console.error('searchModelByName Error fetching users:', error)
      return new Response("searchModelByName failed");
    }
  },


};