const CustomMessage = (type: string, name: string) => ({
  CREATE: `New ${type} record has been created successfully`,
  UPDATE: `${type} record has been updated successfully`,
  DELETE: `${type} has been deleted successfully`,
  SINGLE_GET: `Get successfully ${type} record`,
  GET: `Get successfully ${type} records`,
  ALREADY_EXISTS: `${name} username is already exists`,
  CANNOT_CREATE: `Something went wrong, cannot create ${name}`,
  DOES_NOT_EXISTS: `${name} record does not exists`,
  CANNOT_GET:`cannot get ${name} record`,
  CANNOT_UPDATE:`cannot update ${name} record`
});

export { CustomMessage };
