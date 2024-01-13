//Get Edit info from(a component) the form and send it to the server

"use client";
import React from "react";
import { useState } from "react";
import { Button, Modal } from "antd";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
//import Form from '@/app/projectcomponents/editproject';
import Form from "../../../../../components/projectcomponents/editproject";
import { ModelsAPI } from "../../../../api/modelAPI";

interface EditData {
  modelData: {
    id: string;
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
  userIds: { grantPermission: string[]; revokePermission: string[] };
  //userIds: string[] // userIds:{ "grantPermission":[], "revokePermission":[] }
}

const edit = () => {
  const pathname = usePathname() || "";
  const pathParts = pathname.split("/");
  // Assuming that the pathname structure is /somepath/someotherpath/model_id
  const pid = pathParts[3];

  const router = useRouter();
  const org_id = process.env.NEXT_PUBLIC_ORG_ID;
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [posts, setPosts] = useState<EditData>({
    modelData: {
      id: pid,
      name: "",
      openai_login_id: "",
      // base_model: null,
      login_type: "",
      // git_url: null,
      //commit_hash: null,
      description: null,
      gpt_version: "",
      environment: "",
      critical_threshold: 12.5,
      warning_threshold: 7.5,
    },
    userIds: { grantPermission: [], revokePermission: [] },
    // userIds: [],
  });

  const createAction = async (e: { preventDefault: () => void }) => {
    setSubmitting(true);

    try {
      // Initialize modelData only if posts.modelData is defined
      let modelData = posts.modelData
        ? {
            name: posts.modelData.name,
            // base_model: posts.modelData.base_model,
            // git_url: posts.modelData.git_url,
            // commit_hash: posts.modelData.commit_hash,
            description: posts.modelData.description,
            openai_login_id: posts.modelData.openai_login_id,
            login_type: posts.modelData.login_type,
            gpt_version: posts.modelData.gpt_version,
            environment: posts.modelData.environment,
            critical_threshold: Number(posts.modelData.critical_threshold),
            warning_threshold: Number(posts.modelData.warning_threshold),
          }
        : undefined;

      // Update model data if defined
      if (modelData) {
        const response = await ModelsAPI.updateModelById(
          modelData,
          pid,
          org_id
        );
        console.log("project [pid] response", response);
        if (!response.ok) throw new Error("Failed to update model data");
        console.log("editproject.page form updated model data successfully");
      }

      // Proceed only if posts.userIds is defined
      if (posts.userIds) {
        const Originalviewers =
          await ModelsAPI.getOrgViewersWithModelPermission(pid, org_id);
        const OriginalNonviewers =
          await ModelsAPI.getOrgViewersWithoutModelPermission(pid, org_id);

        let usersIds_grantPermission = posts.userIds.grantPermission
          ? posts.userIds.grantPermission.filter(
              (userId: string) => !Originalviewers.includes(userId)
            )
          : [];

        let usersIds_revokePermission = posts.userIds.revokePermission
          ? posts.userIds.revokePermission.filter(
              (userId: string) => !OriginalNonviewers.includes(userId)
            )
          : [];

        // Grant permissions if there are users to grant
        if (usersIds_grantPermission.length > 0) {
          await ModelsAPI.grantModelPermissionsToViewersInOrg(
            usersIds_grantPermission,
            pid,
            org_id
          );
          console.log(
            "Permissions granted to users:",
            usersIds_grantPermission
          );
        }

        // Revoke permissions if there are users to revoke
        if (usersIds_revokePermission.length > 0) {
          await ModelsAPI.revokeModelPermissionsToViewersInOrg(
            usersIds_revokePermission,
            pid,
            org_id
          );
          console.log(
            "Permissions revoked from users:",
            usersIds_revokePermission
          );
        }
      }

      setShowSuccess(true); // Show the success modal
    } catch (error) {
      console.error("An error occurred during the create action:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    router.push(`/projectlist/project/${pid}/edit`);
    setShowSuccess(false);
  };

  return (
    <div>
      <div>
        <div>
          <div>
            <h3>Edit Project </h3>
            <div>
              <Form
                type="Edit"
                post={posts}
                setPost={setPosts}
                submitting={submitting}
                handleSubmit={createAction}
              />
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

export default edit;
