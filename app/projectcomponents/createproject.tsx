// a component, with the form to create a new project
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "antd";
import { Form, Input, Select, Radio, Row, Col } from "antd";
import CreateProjectPermission from "./createprojectpermission";

interface FormProps {
  type: string;
  post: any;
  setPost: React.Dispatch<React.SetStateAction<any>>;
  submitting: boolean;
  handleSubmit: any;
}

const projectDetailKey: Record<string, string> = {
  name: "Project Name (Max 14 characters):",
  description: "Description (Optional, Max 300 characters):",
  login_type: "Login Type:",
  openai_login_id: "OpenAI Log-in ID:",
  // "base_model": "Base Model (Optional):",
  // "git_url": "Git URL (Optional):",
  // "commit_hash": "Commit Hash (Optional):",
  gpt_version: "ChatGPT Version:",
  environment: "Environment:",
  critical_threshold: "Critical Threshold:",
  warning_threshold: "Warning Threshold:",
};

const loginTypes = ["google", "microsoft", "apple", "email"];
const chatGPTModels = ["ChatGPT 3.5", "ChatGPT 4.0"];

const ProjectForm: React.FC<FormProps> = ({
  type,
  post,
  setPost,
  submitting,
  handleSubmit,
}) => {
  const { modelData } = post;
  const [checkedUsers, setCheckedUsers] = useState<string[]>([]);
  const org_id = process.env.NEXT_PUBLIC_ORG_ID;

  const handleCheckedUsersChange = (
    newCheckedUsers: React.SetStateAction<string[]>
  ) => {
    setCheckedUsers(newCheckedUsers);
    setPost((prevPost: any) => ({
      ...prevPost,
      userIds: newCheckedUsers,
    }));
  };

  const formItems: JSX.Element[] = [];
  for (let key of Object.keys(projectDetailKey)) {
    const isOptional = projectDetailKey[key].includes("Optional");
    const maxLength = isOptional ? 300 : key === "name" ? 14 : undefined;
    formItems.push(
      <Form.Item
        key={key}
        label={projectDetailKey[key]}
        name={key}
        rules={[
          {
            required: !isOptional,
            message: `Please input your ${key}`,
          },
          {
            max: maxLength,
            message: `${projectDetailKey[key]} should be less than or equal to ${maxLength} characters.`,
          },
        ]}
      >
        {key === "login_type" ? (
          <Select
            placeholder="Select a login type"
            onChange={(value) =>
              setPost({ ...post, modelData: { ...modelData, [key]: value } })
            }
          >
            {loginTypes.map((type) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        ) : key === "gpt_version" ? (
          <Radio.Group
            onChange={(e) =>
              setPost({
                ...post,
                modelData: { ...modelData, [key]: e.target.value },
              })
            }
          >
            {chatGPTModels.map((model) => (
              <Radio key={model} value={model}>
                {model}
              </Radio>
            ))}
          </Radio.Group>
        ) : (
          <Input
            value={modelData[key]}
            onChange={(e) =>
              setPost({
                ...post,
                modelData: { ...modelData, [key]: e.target.value },
              })
            }
          />
        )}
      </Form.Item>
    );
  }

  return (
    <section className="form-section">
      <Form layout="vertical" onFinish={handleSubmit}>
        {formItems}
        <Form.Item>
          <CreateProjectPermission
            onCheckedUsersChange={(newCheckedUsers: string[]) =>
              handleCheckedUsersChange(newCheckedUsers)
            }
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            className="submit-button"
          >
            {submitting ? `${type}...` : type}
          </Button>
          <Link href={`/projectlist/${org_id}`}>
            <Button type="default" className="cancel-button" danger>
              Cancel
            </Button>
          </Link>
        </Form.Item>
      </Form>
    </section>
  );
};

export default ProjectForm;
