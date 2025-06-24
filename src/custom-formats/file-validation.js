const fileValidation = (file) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
        alert("Please select a PNG, JPG, or JPEG image.");
        return false;
    }
    // Validate size (max 2 MB)
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
        alert(`File size should be less than ${maxSizeInMB} MB.`);
        return;
    }
    return file;
}
export default fileValidation;