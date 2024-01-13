//fetch the org's users list, display the users name and a checkbox for each users

import React, { useState, useEffect } from "react";
import { Checkbox, Row, Col } from "antd";
import { ModelsAPI } from "../../pages/api/modelAPI";
import { usePathname } from "next/navigation";

interface EditProjectPermissionProps {
  onCheckedUsersChange: (checkedUsers: string[]) => void;
  onUncheckedUsersChange: (uncheckedUsers: string[]) => void;
} //define the props type to pass onCheckedUsersChange


const EditProjectPermission: React.FC<EditProjectPermissionProps> = ({
  onCheckedUsersChange,
  onUncheckedUsersChange,
}) => {
  const columnSpan = 24 / 4; // for formatting purpose, 4 columns per row

  const [users, setUsers] = useState<string[]>([]);
  const [Viewerusers, setViewerUsers] = useState<string[]>([]);
  // status of the checkboxs; checkedUsers is an array of checked users' id; update in time
  const [checkedUsers, setCheckedUsers] = useState<string[]>([]);
  const [uncheckedUsers, setUncheckedUsers] = useState<string[]>([]);

  const pathname = usePathname()?.split("/") || [];
  const model_id = pathname[3];

  //拿到所有的用户列表，然后把权限用户id放到checkedUsers里面
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseWithoutPermission =
          await ModelsAPI.getOrgViewersWithoutModelPermission(
            model_id,
            process.env.NEXT_PUBLIC_ORG_ID
          );
        const responseWithPermission =
          await ModelsAPI.getOrgViewersWithModelPermission(
            model_id,
            process.env.NEXT_PUBLIC_ORG_ID
          );

        setUsers(responseWithoutPermission); // Users without permission
        setViewerUsers(responseWithPermission); // Users with permission
        setCheckedUsers(responseWithPermission); // Initially check the users with permission
      } catch (error) {
        console.error("There was a problem fetching users:", error);
      }
    };

    fetchUsers();
  }, [model_id]);

  // Handle checkbox changes with a functional update
  const handleCheckUser = (userId: string) => {
    setCheckedUsers((prevCheckedUsers) => {
      const newCheckedUsers = [...prevCheckedUsers, userId];
      setTimeout(() => onCheckedUsersChange(newCheckedUsers), 0);
      return newCheckedUsers;
    });

    // Also update uncheckedUsers if needed
    setUncheckedUsers((prevUncheckedUsers) =>
      prevUncheckedUsers.filter((id) => id !== userId)
    );
  };

  // A function to handle unchecking a user
  const handleUncheckUser = (userId: string) => {
    setCheckedUsers((prevCheckedUsers) =>
      prevCheckedUsers.filter((id) => id !== userId)
    );

    setUncheckedUsers((prevUncheckedUsers) => {
      const newUncheckedUsers = [...prevUncheckedUsers, userId];
      setTimeout(() => onUncheckedUsersChange(newUncheckedUsers), 0);
      return newUncheckedUsers;
    });
  };

  const onCheckboxChange = (checked: boolean, userId: string) => {
    if (checked) {
      handleCheckUser(userId);
    } else {
      handleUncheckUser(userId);
    }
  };

  return (
    <div>
      <h2>Grant Users Permission</h2>
      <Row gutter={[16, 16]}>
        {users.map(
          (
            user //after connecting to USER database, change to key={user}, <span>{user.name }</span> is better
          ) => (
            <Col
              key={user}
              span={columnSpan}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={4}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  onChange={(e) => onCheckboxChange(e.target.checked, user)}
                  checked={checkedUsers.includes(user)}
                />
                <span>{user}</span>
              </div>
            </Col>
          )
        )}
      </Row>
      <br></br>
      <h2>Revoke Users Permission</h2>
      <Row gutter={[16, 16]}>
        {Viewerusers.map(
          (
            user //after connecting to USER database, change to key={user}, <span>{user.name }</span> is better
          ) => (
            <Col
              key={user}
              span={columnSpan}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={4}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  onChange={(e) => onCheckboxChange(e.target.checked, user)}
                  checked={checkedUsers.includes(user)}
                />
                <span>{user}</span>
              </div>
            </Col>
          )
        )}
      </Row>
    </div>
  );
};

export default EditProjectPermission;
