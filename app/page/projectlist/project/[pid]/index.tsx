import React, { useState, useEffect } from "react";
import { ModelsAPI } from "../../../api/modelAPI";
import { usePathname } from "next/navigation";
import AccessButton from "../../../../components/projectcomponents/AccessButton";

const Page = () => {
  const [role, setRole] = useState(null);
  const org_id = process.env.NEXT_PUBLIC_ORG_ID;
  const pathname = usePathname().split("/");
  const model_id = pathname[3];

  useEffect(() => {
    const fetchRole = async () => {
      const userRole = await ModelsAPI.checkUserAccessToModel(model_id, org_id);
      setRole(userRole);
    };

    fetchRole();
  }, [model_id, org_id]); // Add dependencies array if your function depends on variables that could change

  // Ensure that role is not null before rendering components that depend on it
  if (role === null) {
    return <div>Loading...</div>; // Render a loading state or null while the role is being fetched
  }

  return (
    <div>
      Model detail page as a {role}
      {role === "non-viewer" && ( // Changed the condition to match the role check
        <AccessButton orgId={org_id} modelId={model_id} />
      )}
    </div>
  );
};

export default Page;
