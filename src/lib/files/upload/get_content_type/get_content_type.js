export const get_content_type = (file_extension) => {
    const content_type = {
        pdf: 'application/pdf',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
    };

    return content_type[file_extension.toLowerCase()];
};