const fs = require('fs');
const path = require('path');
const { File } = require('../../models');
const removeAttachmentFiles = async () => {
  try {
    const filesPath = path.join(path.resolve(), 'public/contact-us');
    const files = fs.readdirSync(filesPath);
    if (files.length) {
      for (const file of files) {
        await File.destroy({
          where: {
            FileableId: file,
            FileableType: 'contact-us',
          },
        });
        fs.rmdirSync(path.join(filesPath, file), { recursive: true });
      }
    }
    console.log('files', files);
  } catch (e) {
    console.log('Catch error for removeAttachmentFiles', e);
  }
};

module.exports = removeAttachmentFiles;
