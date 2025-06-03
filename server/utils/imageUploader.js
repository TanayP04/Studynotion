const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, width) => {
  const options = {
    folder: folder,
    resource_type: "auto",
  };

  if (height && width) {
    options.height = height;
    options.width = width;
    options.crop = "fill";
  }

  return await cloudinary.uploader.upload(file.tempFilePath, options);
};
