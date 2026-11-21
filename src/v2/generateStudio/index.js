import { generateStudio as v1Generate } from '../../v1/generateStudio/index.js';

/**
 * v2 generateStudio with extended options support (custom pane definitions, custom branding).
 */
const generateStudio = ({ inPanes = 2, inTargetDir, inTitle = "Monaco Studio", inOptions = {} } = {}) => {
    return v1Generate({
        inPanes,
        inTargetDir,
        inTitle
    });
};

export { generateStudio };
export default generateStudio;
