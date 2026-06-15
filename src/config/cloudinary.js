const { v2: cloudinary } = require("cloudinary");

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const uploadPreset =
  process.env.CLOUDINARY_UPLOAD_PRESET ||
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

const configuredCloudinary = cloudinary.config();

function uploadJobImage(buffer) {
  if (!configuredCloudinary.cloud_name) {
    throw new Error("CLOUDINARY_CLOUD_NAME is missing from backend environment variables.");
  }

  const signedUploadConfigured = Boolean(
    configuredCloudinary.api_key && configuredCloudinary.api_secret,
  );
  if (!signedUploadConfigured && !uploadPreset) {
    throw new Error(
      "Cloudinary API credentials or CLOUDINARY_UPLOAD_PRESET are required.",
    );
  }

  const options = {
    folder: "jobboard/jobs",
    resource_type: "image",
    transformation: [{ width: 1600, height: 900, crop: "limit" }],
  };

  return new Promise((resolve, reject) => {
    const callback = (error, result) => {
      if (error) return reject(error);
      resolve(result);
    };

    const stream =
      signedUploadConfigured
        ? cloudinary.uploader.upload_stream(options, callback)
        : cloudinary.uploader.unsigned_upload_stream(
            uploadPreset,
            options,
            callback,
          );

    stream.end(buffer);
  });
}

function uploadRemoteJobImage(imageUrl) {
  if (!configuredCloudinary.cloud_name) {
    throw new Error("CLOUDINARY_CLOUD_NAME or CLOUDINARY_URL is missing.");
  }

  const signedUploadConfigured = Boolean(
    configuredCloudinary.api_key && configuredCloudinary.api_secret,
  );
  const options = {
    folder: "jobboard/seed-jobs",
    resource_type: "image",
    transformation: [{ width: 1600, height: 900, crop: "fill", gravity: "auto" }],
  };

  if (signedUploadConfigured) {
    return cloudinary.uploader.upload(imageUrl, options);
  }
  if (uploadPreset) {
    return cloudinary.uploader.unsigned_upload(imageUrl, uploadPreset, options);
  }

  throw new Error(
    "Cloudinary API credentials or CLOUDINARY_UPLOAD_PRESET are required.",
  );
}

async function deleteJobImage(publicId) {
  if (
    !publicId ||
    !configuredCloudinary.api_key ||
    !configuredCloudinary.api_secret
  ) {
    return;
  }
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (error) {
    console.warn(`Unable to delete Cloudinary image ${publicId}: ${error.message}`);
  }
}

module.exports = { uploadJobImage, uploadRemoteJobImage, deleteJobImage };
