//Get CREATEPROJECT info from(a component) the form and send it to the server

"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { useRouter } from "next/navigation";
import Form from "../../components/projectcomponents/createproject";
import { ModelsAPI } from "../api/modelAPI";

interface CreateData {
  modelData: {
    org_id: string;
    name: string;
    // base_model: string | null;
    // git_url: string | null;
    // commit_hash: string | null;
    description: string | null;
    gpt_version: string;
    environment: string;
    openai_login_id: string;
    login_type: string;
    critical_threshold: number;
    warning_threshold: number;
  };
  userIds: string[];
}

const createNew = () => {
  const org_id = process.env.NEXT_PUBLIC_ORG_ID;

  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [posts, setPosts] = useState<CreateData>({
    modelData: {
      org_id: org_id!,
      name: "",
      // base_model: null, //Optional
      // git_url: null, //Optional
      // commit_hash: null, //Optional
      description: null, //Optional
      gpt_version: "ChatGPT 3.5", //ChatGPT 3.5, ChatGPT 4.0
      environment: "",
      openai_login_id: "", //Optional
      login_type: "email", //email, google, microsoft, apple
      critical_threshold: 12.5,
      warning_threshold: 7.5,
    },
    userIds: [], //initially no user is selected as viewer
  });

  // while submit button has been clicked, setSubmitting is true
  const createAction = async (e: { preventDefault: () => void }) => {
    setSubmitting(true);

    try {
      let modelData = {
        org_id: posts.modelData.org_id,
        name: posts.modelData.name,
        // base_model: posts.modelData.base_model,
        // git_url: posts.modelData.git_url,
        // commit_hash: posts.modelData.commit_hash,
        description: posts.modelData.description,
        gpt_version: posts.modelData.gpt_version,
        environment: posts.modelData.environment,
        openai_login_id: posts.modelData.openai_login_id,
        login_type: posts.modelData.login_type,
        critical_threshold: Number(posts.modelData.critical_threshold),
        warning_threshold: Number(posts.modelData.warning_threshold),
      };
      let usersIds = posts.userIds;

      //console.log("createproject.page modelData", modelData);
      //console.log("createproject.page usersIds", usersIds);

      const response = await ModelsAPI.createUserModels(modelData);
      // const responsePermission = await ModelsAPI.createModelPermission( usersIds );

      if (response.ok) {
        console.log("createproject.page form created succuss");

        const getModel_id = await ModelsAPI.GetModelsInOrgByUpdateTime(org_id);
        const model_id = getModel_id.accessibleModels[0].model_id.toString();
        console.log("createproject.page get model_id", model_id, usersIds);
        //give a list of users permission to view the model
        if (usersIds.length > 0) {
          await ModelsAPI.grantModelPermissionsToViewersInOrg(
            usersIds,
            model_id,
            org_id
          );
        } else {
          console.log("No user is selected as a viewer");
        }

        setShowSuccess(true); // Show the success modal
        //console.log("submit data in /createproject", posts);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRouteChange = () => {
    router.push(`/projectlist/${org_id}`);
  };

  const closeModal = () => {
    handleRouteChange();
    setShowSuccess(false);
  };

  return (
    <div>
      <div>
        <div>
          <div>
            <h3>Create A New Project</h3>
            <div>
              <Form
                type="Create"
                post={posts}
                setPost={setPosts}
                submitting={submitting}
                handleSubmit={createAction}
              />

              {/* Show the success modal when showSuccess is true */}
              <Modal
                open={showSuccess}
                onOk={closeModal}
                onCancel={closeModal}
                footer={[
                  <Button key="ok" type="primary" onClick={closeModal}>
                    OK
                  </Button>,
                ]}
              >
                <p>Thanks! You have Successfully Created A Project</p>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default createNew;
