//fetch the org's users list, display the users name and a checkbox for each users

import React, { useState, useEffect } from "react";
import { Checkbox, Row, Col } from "antd";
import { ModelsAPI } from "../../pages/api/modelAPI";

interface CreateProjectPermissionProps {
  onCheckedUsersChange: (checkedUsers: string[]) => void;
} //define the props type to pass onCheckedUsersChange


const CreateProjectPermission: React.FC<CreateProjectPermissionProps> = ({
  onCheckedUsersChange,
}) => {
  const columnSpan = 24 / 4; // for formatting purpose, 4 columns per row

  const [users, setUsers] = useState<string[]>([]);
  //console.log(users);

  // status of the checkboxs; checkedUsers is an array of checked users' id; update in time
  const [checkedUsers, setCheckedUsers] = useState<string[]>([]);

  // Handle checkbox changes with a functional update
  const onCheckboxChange = (checked: boolean, userId: string) => {
    setCheckedUsers((prevCheckedUsers) => {
      const newCheckedUsers = checked
        ? [...prevCheckedUsers, userId]
        : prevCheckedUsers.filter((id) => id !== userId);
      onCheckedUsersChange(newCheckedUsers);
      return newCheckedUsers; // array of checked users in time
    });
  };
  //console.log("createprojectpermission.tsx checkedUsers", checkedUsers);

  // Update the parent component with the checked users
  /*useEffect(() => {
        onCheckedUsersChange(checkedUsers);
    }, [checkedUsers, onCheckedUsersChange]); // Only re-run the effect if checkedUsers changes
*/

  // Fetch users id and name when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await ModelsAPI.getViewersInOrg(
          process.env.NEXT_PUBLIC_ORG_ID!
        );
        setUsers(response); // Set users in state
      } catch (error) {
        console.error(
          "There was a problem fetching users CreateProjectPermission:",
          error
        );
      }
    };

    fetchUsers();
  }, []); // Empty array ensures this effect runs once on mount

  //console.log("createprojectpermission.tsx fetch users", users);
  return (
    <div>
      <h1>Create Project Permission</h1>
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
    </div>
  );
};

export default CreateProjectPermission;
