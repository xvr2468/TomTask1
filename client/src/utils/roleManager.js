let isMentorAssigned = false;

export const getRole = () => {
  if (!isMentorAssigned) {
    isMentorAssigned = true;
    return 'mentor';
  }
  return 'student';
};
