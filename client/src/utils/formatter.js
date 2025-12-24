export const capitalizeText = (text = '') => {
  if (!text) return '';

  return text
    .toLowerCase()
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatPhone = (phone = '') => {
  if (!phone) return '';

  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
};

export const formatEmail = (email = '') => {
  return email.toLowerCase();
};

export const formatStatus = (status = '') => {
  return capitalizeText(status);
};

export const formatTitle = (title = '') => {
  return capitalizeText(title);
};

export const formatEnumText = (value = '') => {
  if (!value) return '';

  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};