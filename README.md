This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev 
npm run dev -- -p 3080
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3080](http://localhost:3080) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Workflow and decription

Sure, here's the translated content:

### Project List http://localhost:3080/projectlist/:org_id
http://localhost:3080/projectlist/36f0913c-9f37-41fe-99a0-85acb2324b39

1. √ Get the user's list of all projects in the org
	1. Get: /model/:org_id
2. √ Query users' admin privileges: admin can edit, viewer can see some details and has no request button, non-viewer shows request access button
	1. POST user_model/view-access (checkUserAccessToModel)
3. √ Search function
	1. GET model/:org_id?search=keyword
4. √ EDIT + DELETE functionality
	1. EDIT page redirects to ./projectlist/project/:model_id/edit
	2. DELETE /model/:model_id/:org_id
5. Create project button is only displayed for org owner || admin == true
	1. TODO GET userid
	2. √ GET getOwnersInOrg 

### Create Project http://localhost:3080/create
1. √ Post form info 
	1. POST /model/create
2. √ Access Permission 1: get all viewers in the org 
	1. GET /user_org/viewers/org_id getViewersInOrg is in user_org as org's viewers
	2. Get all org viewers, listen to the checkbox, if checked, then submit a user_ids array when submitting, granting permission to each user_id 
3. √ Access Permission 2: post users' permission information 
	1. GET GetModelsInOrgByUpdateTime to get the latest model id
	2. POST /user_model/grant-permissions/:model_id/:org_id
		1. grantModelPermissionsToViewersInOrg authorize for a user_id array
		
### Edit Project http://localhost:3080/projectlist/project/:model_id/edit

1. √ Get model detail information as input placeholder
	1. GET /model/:model_id/:org_id (getModelById)
2. √ Get user's role in that model, if user is admin they can edit & delete, viewer can not
	1. POST user_model/view-access { modelID: ..., orgID...}
3. √ Get users permission, viewers can be non-checked, non-viewers can be checked
	1. GET /user_model/non-viewers/:org_id/:model_id to get all non-viewers of a project, returns a userIds array
	2. GET /user_model/viewers/:org

_id/:model_id to get all viewers of a project, returns a userIds array
4. √ Update form info
	1. PUT /model/:model_id/:org_id to update a project/edit
	2. TODO: The backend still requires thresholds to be mandatory, this needs to be changed.
5. √ POST user permission viewers info
	1. POST /user_model/grant-permissions/:model_id/:org_id to add viewer permissions for a batch of users (userids)
	2. POST /user_model/revoke-permissions/:model_id/:org_id to cancel viewer permissions for a batch of users (userids)

### Request a Model Permission
1. √ Obtain the user's role permission, the button is only displayed for non-viewers of that model
	1. POST /user_model/view-access
TO DO
2. The backend needs a POST request API, and model request status added to the data schema (categorized as notRequested, pending, approved)
	1. √ If the request button is pressed, the button status will change to pending
3. The backend needs a GET API for models with request status

## Admin Backend Routes

Run the development server with:

```bash
npm run start:dev
```

/model

GET /model/:org_id to get all projects in an organization (project lists)

POST /model/create to create a project (/create)

PUT /model/:model_id to update a project (/edit)

DELETE /model/:model_id to delete a project (/delete)

/users

GET /users/:uuid to get user information

/user_model

POST /user_model/view-access to query a user's permissions for a specific project in an org, returns BOOLEAN

GET /user_model/viewers/:org_id/:model_id to get all viewers of a project, returns a userIds array

GET /user_model/non-viewers/:org_id/:model_id to get all non-view

ers of a project, returns a userIds array

POST /user_model/grant-permissions/:model_id/:org_id to grant viewer permissions to a batch of users (userids)

/user_org

GET /user_org/viewers/:id to get all viewers of an organization, returns a userIds array

POST /user_org/role to get a user's role in the org views, returns the role, such as admin or viewer

GET /user_org/owners/:org_id to get the owner of an organization, returns the owner's user id

GET /user_org/admin/:org_id to get the admin of an organization, returns the admin's user id

GET /user_org/viewers/:org_id to get the viewers of an organization, returns the viewers' user ids
