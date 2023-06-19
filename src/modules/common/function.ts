export const convertToMessageResponse = async (result: any) => {
  const errorMessages = result.error.details.reduce((errors : any, detail : any) => {
    const key = detail.context?.key ?? 'unknown';
    const message = detail.message.replace(/['"]+/g, '');
    errors[key] = message;
    return errors;
  }, {});
  return errorMessages;
};
