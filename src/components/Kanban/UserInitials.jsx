const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

// Genera un color basado en el nombre
const getColorFromName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 85%)`; // Color pastel
};

const UserInitials = ({ name, size = "small" }) => {
  const initials = getInitials(name);
  const backgroundColor = getColorFromName(name);
  const textColor = "text-gray-700";

  const sizeClasses = {
    small: "w-6 h-6 text-xs",
    medium: "w-8 h-8 text-sm",
    large: "w-10 h-10 text-base",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold ${textColor}`}
      style={{ backgroundColor }}
      title={name}
    >
      {initials}
    </div>
  );
};

export default UserInitials;
