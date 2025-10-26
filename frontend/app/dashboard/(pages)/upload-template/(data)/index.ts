export const UPLOAD_TEMPLATE = {
    title: 'Upload SVG Template',
    inputLabels: {
        title: 'Template Title',
        description: 'Description (Optional)',
    },
    alerts: {
        noFile: 'Please upload an SVG file with Title before deploying.',
        noFields: 'No required fields (e.g., {{field_name}}) found in SVG',
        deploySuccess: 'Template deployed successfully to blockchain!',
        deployError: (error: string) => `Deployment failed: ${error}`,
    },
    fileTypes: {
        svg: 'image/svg+xml'
    }
};

export const DEPLOYMENT_INSTRUCTIONS = [
    "Use {{field name}} for required fields or variables",
    "Once deployed, templates can be used to issue documents with dynamic data"
];