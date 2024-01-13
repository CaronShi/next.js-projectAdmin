// a component, with the form to create a new project

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import { Form, Input, Select, Radio } from 'antd';
import { ModelsAPI } from "../../pages/api/modelAPI";
import EditProjectPermission from "./editprojectpermission";
import { usePathname } from 'next/navigation'
interface FormProps {
    type: string; //用于定义表单的类型或提交按钮的文本
    post: any; //对象参数，用于存储和展示表单的数据。{modelData: {…}, userIds: Array(0)}
    setPost: React.Dispatch<React.SetStateAction<any>>; //React 状态更新函数
    submitting: boolean; //用于定义提交按钮的加载状态
    handleSubmit: any; //处理表单提交函数, 当用户点击提交按钮时，这个函数会被调用
}

var CanNotEdit = ["created_at", "id", "org_id", "updated_at", "openai_login_id", "login_type", "base_model", "git_url", "commit_hash"]

const projectDetailKey: Record<string, string> = {
    "id": "Project ID:",
    "org_id": "Organization ID:",
    "name": "Project Name (Max 14 characters):",
    "description": "Description (Optional, Max 300 characters):",
    "login_type": "Login Type:",
    "openai_login_id": "OpenAI Log-in ID:",
    // "base_model": "Base Model (Optional):",
    // "git_url": "Git URL (Optional):",
    // "commit_hash": "Commit Hash (Optional):",
    "gpt_version": "ChatGPT Version:",
    "environment": "Environment:",
    "critical_threshold": "Critical Threshold:",
    "warning_threshold": "Warning Threshold:",
};

const chatGPTModels = ["ChatGPT 3.5", "ChatGPT 4.0"];
const ProjectForm: React.FC<FormProps> = ({ type, post, setPost, submitting, handleSubmit }) => {
    const pathname = usePathname() || '';
    const pathParts = pathname.split("/");
    // Assuming that the pathname structure is /somepath/someotherpath/model_id
    const model_id = pathParts[3];

    const { modelData = {} } = post; // destructuring modelData from post, // Default to an empty object if modelData is undefined
    //console.log("modelData", modelData)
    //get the project data from the server
    const [project, setProject] = useState(null);
    useEffect(() => {
        const fetchProject = async () => {
            const org_id = process.env.NEXT_PUBLIC_ORG_ID;

            const response = await ModelsAPI.getModelById(model_id, org_id);
            setProject(response);
            setPost(response); // if you need to update the 'post' state with the fetched data
        }; fetchProject();
    }, [modelData.id]);

    const [checkedUsers, setCheckedUsers] = useState([]);
    const [uncheckedUsers, setUncheckedUsers] = useState([]);
    //console.log("checkedUsers", checkedUsers, "uncheckedUsers", uncheckedUsers)

    const formItems: JSX.Element[] = [];

    if (project === null || !pathname) {
        // You could return a loading spinner or any placeholder here
        return <div>Loading...</div>;
    }

    const handleCheckedUsersChange = (newCheckedUsers: React.SetStateAction<never[]>) => {
        setCheckedUsers(newCheckedUsers);
        updatePostUserIds(newCheckedUsers, uncheckedUsers);
    };

    const handleUnCheckedUsersChange = (newUncheckedUsers: React.SetStateAction<never[]>) => {
        setUncheckedUsers(newUncheckedUsers);
        updatePostUserIds(checkedUsers, newUncheckedUsers);
    };

    const updatePostUserIds = (checked: never[] | ((prevState: never[]) => never[]), unchecked: never[] | ((prevState: never[]) => never[])) => {
        setPost((prevPost: any) => ({
            ...prevPost,
            userIds: {
                grantPermission: checked,
                revokePermission: unchecked
            }
        }));
    };


    // Iterate through the project data and create Form.Items for each field
    for (const [k, value] of Object.entries(project)) {
        let key = projectDetailKey[k]


        // let isOptional = ["description", "git_url", "commit_hash", "base_model"].includes(k) ? true : false
        let isOptional = ["description"].includes(k) ? true : false
        var threshold = ["critical_threshold", "warning_threshold"]
        // let maxLength = key === "description" ? 300 : key === "name" ? 14 : undefined;
        let maxLength;
        key === "Description (Optional, Max 300 characters):" ? maxLength = 300 : maxLength = 14;

        if (key === "gpt_version") { console.log("gpt_version", value) }
        if (Object.hasOwnProperty.call(project, k)) {
            if (!CanNotEdit.includes(k) && !threshold.includes(k)) {
                formItems.push(
                    <Form.Item
                        key={key}
                        label={key}
                        name={key}
                        initialValue={value}
                        rules={[
                            {
                                required: !isOptional,
                                message: `Please input your ${key}`,
                            },
                            {
                                max: maxLength,
                                message: `${k} should be less than or equal to ${maxLength} characters.`,
                            },

                        ]}            >
                        {k === "gpt_version" ? (<Radio.Group
                            onChange={(e) => setPost({ ...post, modelData: { ...modelData, [k]: e.target.value } })}
                            value={modelData[k]} // Add this line to set the initial value
                        >
                            {chatGPTModels.map((model) => (
                                <Radio key={model} value={model}>
                                    {model}
                                </Radio>
                            ))}
                        </Radio.Group>
                        ) : (
                            <Input
                                placeholder={`${value}`}
                                value={modelData[k]}
                                onChange={(e) => setPost({ ...post, modelData: { ...modelData, [k]: e.target.value } })}
                            />)}
                    </Form.Item>

                );
            }
            else if (threshold.includes(k)) {
                formItems.push(
                    <Form.Item
                        key={key}
                        label={key}
                        name={key}
                        initialValue={value}
                        rules={[
                            {
                                required: !isOptional,
                                message: `Please input your ${key}`,
                            },

                            {
                                pattern: /^(\d{1,2}(\.\d{1,2})?|100)$/,
                                message: `Please input a number between 0 and 100`,
                            },
                        ]}            >
                        <Input
                            placeholder={`${value}`}
                            value={modelData[k]}
                            onChange={(e) => setPost({ ...post, modelData: { ...modelData, [k]: e.target.value } })}
                        />
                    </Form.Item>

                );
            }


        }


    }
    return (
        <section className="form-section">
            <Form
                layout="vertical"
                onFinish={handleSubmit}
            >
                {formItems}
                <Form.Item>

                    <EditProjectPermission onCheckedUsersChange={(newCheckedUsers: string[]) => handleCheckedUsersChange(newCheckedUsers as never[])}
                        onUncheckedUsersChange={(uncheckedUsers: string[]) => handleUnCheckedUsersChange(uncheckedUsers as never[])}

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
                    <Link href={`../`}>
                        <Button type="default" className="cancel-button" danger>
                            Cancel
                        </Button>
                    </Link>
                </Form.Item>



            </Form>
        </section>
    );
};

export default ProjectForm