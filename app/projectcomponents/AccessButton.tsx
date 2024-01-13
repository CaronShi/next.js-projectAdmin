import React, { useState } from 'react';
import { Button } from 'antd';
import { ModelsAPI } from  "../../pages/api/modelAPI";

interface AccessButtonProps {
    orgId: any;
    modelId: string;
}
const AccessButton: React.FC<AccessButtonProps> = ({ orgId, modelId }) => {
    const [loading, setLoading] = useState(false);
    const [isAccessRequested, setAccessRequested] = useState(false);

    const handleRequestAccess = async () => {
        try {
            setLoading(true); // Set loading to true when the button is clicked
            // Perform the access request
            //await ModelsAPI.requestAccessToModel(model_id, org_id);
            console.log("await handleRequestAccess")
            // Request was successful, you can perform any additional actions here
        } catch (error) {
            throw new Error('Network response in handleRequestAccess button was not ok');
        }

    };

    return (
        <Button
            type="default"
            onClick={handleRequestAccess}
            loading={loading}
            disabled={loading || isAccessRequested}
        >
            {loading ? 'Pending...' : isAccessRequested ? 'Access Requested' : 'Request Access'}
        </Button>
    );
};

export default AccessButton;
