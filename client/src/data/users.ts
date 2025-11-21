export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "client";
  password: string;
  phone?: string;
}

export const users: AuthUser[] = [
  {
    id: "admin-1",
    name: "مدير النظام",
    email: "admin@example.com",
    role: "admin",
    password: "123",
    phone: "+967 1 234567"
  },
  {
    id: "user-1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    role: "client",
    password: "123",
    phone: "+967 777 123456"
  },
  {
    id: "user-2", 
    name: "فاطمة علي",
    email: "fatima@example.com",
    role: "client",
    password: "123",
    phone: "+967 733 987654"
  }
];

export const authenticateUser = (email: string, password: string): AuthUser | null => {
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
};

// Load users from localStorage on initialization
const loadUsersFromStorage = (): AuthUser[] => {
  try {
    const storedUsers = localStorage.getItem("gsc_users");
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
  } catch (error) {
    console.error("Error loading users from localStorage:", error);
  }
  return users;
};

// Save users to localStorage
const saveUsersToStorage = (usersData: AuthUser[]): void => {
  try {
    localStorage.setItem("gsc_users", JSON.stringify(usersData));
  } catch (error) {
    console.error("Error saving users to localStorage:", error);
  }
};

// Initialize users from storage or use defaults
let currentUsers = loadUsersFromStorage();

// Export mutable users list
export const getUsersList = (): AuthUser[] => {
  return currentUsers;
};

export const addUser = (user: Omit<AuthUser, "id">): AuthUser => {
  const newUser: AuthUser = {
    ...user,
    id: `user-${Date.now()}`
  };
  
  currentUsers.push(newUser);
  saveUsersToStorage(currentUsers);
  return newUser;
};

export const updateUser = (userId: string, updates: Partial<Omit<AuthUser, "id">>): AuthUser | null => {
  const userIndex = currentUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;
  
  currentUsers[userIndex] = { ...currentUsers[userIndex], ...updates };
  saveUsersToStorage(currentUsers);
  return currentUsers[userIndex];
};