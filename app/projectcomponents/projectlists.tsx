// Import your dependencies
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { List, Dropdown, Menu } from "antd";
import styles from "./styles/index.module.css";
import { ModelsAPI } from "../../pages/api/modelAPI";
import { EllipsisOutlined } from "@ant-design/icons";

export function ProjectLists() {
  const [accessibleProjects, setAccessibleProjects] = useState<any[]>([]);
  const [inaccessibleProjects, setInaccessibleProjects] = useState<any[]>([]);
  const [admins, setAdmins] = useState<string[]>([]);
  const org_id = process.env.NEXT_PUBLIC_ORG_ID;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ModelsAPI.GetModelsInOrgByUpdateTime(org_id);
        const accessibleModels = response.accessibleModels || [];
        const inaccessibleModels = response.inaccessibleModels || [];
        const model_ids = accessibleModels.map(
          (project: { model_id: any }) => project.model_id
        );

        setAccessibleProjects(accessibleModels);
        setInaccessibleProjects(inaccessibleModels);

        // Fetch roles for model_ids and identify admins
        const roles = await Promise.all(
          model_ids.map(async (model_id: string) => {
            const role = await ModelsAPI.checkUserAccessToModel(
              model_id,
              org_id
            );
            if (role === "owner" || role === "admin") {
              setAdmins((prevAdmins) => [...prevAdmins, model_id]);
            }

            return { model_id, role };
          })
        );
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        // Handle errors as needed
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (model_id: any) => {
    try {
      const response = await ModelsAPI.deleteUserModelsByModelId(
        model_id,
        org_id
      );
      if (response.ok) {
        // Update projects state to remove deleted model
        console.log("Model_id:", model_id, "has been deleted");
        setAccessibleProjects(
          accessibleProjects.filter((project) => project.model_id !== model_id)
        );
      } else {
        // Handle non-successful responses
        console.error("Error deleting the model:", response.statusText);
      }
    } catch (error) {
      console.error("Error during delete request:", error);
    }
  };
  const menu = (model_id: string) => (
    <Menu>
      <Menu.Item key="edit">
        {/* Use the new Link component syntax without <a> tag */}
        <Link href={`/projectlist/project/${model_id}/edit`} passHref>
          Edit
        </Link>
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(model_id)}>
        {/* For non-link actions like delete, you can just use a button or div */}
        <div>Delete</div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.createNew}>
      <List
        className={styles.listContainer}
        itemLayout="horizontal"
        dataSource={accessibleProjects}
        renderItem={(project) => (
          <List.Item
            actions={[
              admins.includes(project.model_id) ? (
                <Dropdown
                  overlay={menu(project.model_id)}
                  trigger={["click"]}
                  key="more"
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <EllipsisOutlined
                      style={{
                        transform: "rotate(90deg)",
                        fontSize: "22px",
                        color: "#000",
                      }}
                    />
                  </a>
                </Dropdown>
              ) : null,
            ]}
          >
            <List.Item.Meta
              title={
                <Link href={`./project/${project.model_id}`} passHref>
                  {project.model_name}
                </Link>
              }
            />
          </List.Item>
        )}
      />

      <List.Item className={styles.permissionHeader}>
        Need Permission{" "}
      </List.Item>
      <List
        className={styles.listContainer}
        itemLayout="horizontal"
        dataSource={inaccessibleProjects}
        renderItem={(project) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Link href={`./project/${project.model_id}`} passHref>
                  {project.model_name}
                </Link>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}
