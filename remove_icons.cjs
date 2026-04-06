const fs = require('fs');

const file = 'src/icons/index.ts';
let content = fs.readFileSync(file, 'utf8');

const unusedIcons = [
  'Projector', 'FileText', 'ErrorHexaIcon', 'AlertHexaIcon', 'MoreDotIcon', 'DownloadIcon', 'FileIcon', 'AudioIcon', 'VideoIcon', 'BoltIcon', 'CloseIcon', 'CheckCircleIcon', 'AlertIcon', 'InfoIcon', 'ErrorIcon', 'FolderIcon', 'ArrowRightIcon', 'ShootingStarIcon', 'DollarLineIcon', 'TrashBinIcon', 'AngleUpIcon', 'AngleDownIcon', 'PencilIcon', 'CheckLineIcon', 'CloseLineIcon', 'PaperPlaneIcon', 'LockIcon', 'UserIcon', 'CopyIcon', 'ChevronLeftIcon', 'UserCircleIcon', 'TaskIcon', 'ListIcon', 'TableIcon', 'PageIcon', 'PieChartIcon', 'BoxCubeIcon', 'PlugInIcon', 'DocsIcon', 'MailIcon', 'ChevronUpIcon', 'ChatIcon', 'AngleLeftIcon', 'AngleRightIcon', 'ProfileIcon'
];

unusedIcons.forEach(icon => {
  // Remove import
  const importRegex = new RegExp(`^.*?import { ReactComponent as ${icon} }.*?\\n`, 'gm');
  content = content.replace(importRegex, '');
  
  // Remove export
  const exportRegex = new RegExp(`^\\s*${icon},\\n`, 'gm');
  content = content.replace(exportRegex, '');
});

fs.writeFileSync(file, content, 'utf8');
console.log('Removed unused icons from src/icons/index.ts');
