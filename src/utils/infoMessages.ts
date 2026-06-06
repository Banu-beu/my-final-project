export const createMessage = (title: string, data?: unknown) => {
  return {
    message: `${title} was created`,
    data: data,
  };
};

export const editMessage = (title: string, data?: unknown) => {
  return {
    message: `${title} was updated`,
    data: data,
  };
};

export const deleteMessage = (title: string, data?: unknown) => {
  return {
    message: `${title} was deleted`,
    data: data,
  };
};

export const errorMessage = (message: string, error?: unknown) => {
  return {
    message: message,
    error: error,
  };
};