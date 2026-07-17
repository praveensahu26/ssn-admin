import { getConnectyCube } from '@/lib/connectyCube';

export interface ConnectyCubeUser {
  id: number;
  login: string;
  email?: string;
  fullName?: string;
  customData?: any;
}

export interface ConnectyCubeSession {
  token: string;
  userId: number;
}

let currentUser: ConnectyCubeUser | null = null;
let currentSession: ConnectyCubeSession | null = null;
let isChatConnected = false;
let sessionRestorationPromise: Promise<void> | null = null;

// Restore session from ConnectyCube SDK on module load
async function restoreSessionFromSDK() {
  try {
    const storedCredentials = localStorage.getItem('connectyCubeCredentials');
    if (storedCredentials) {
      const credentials = JSON.parse(storedCredentials) as { email: string; password: string };
      
      const CB = getConnectyCube();
      
      // Re-authenticate with stored credentials
      const session = await CB.auth.createSession({ email: credentials.email, password: credentials.password });
      const sessionData = session as any;
      
      currentSession = {
        token: sessionData.token,
        userId: sessionData.user_id || sessionData.userId,
      };
      
      
      // Connect to chat for real-time messaging
      await connectToChat();
    } else {
    }
  } catch (error) {
    console.error('Failed to restore session from credentials:', error);
    // Clear invalid stored credentials
    localStorage.removeItem('connectyCubeCredentials');
  }
}

// Start restoration on module load
sessionRestorationPromise = restoreSessionFromSDK();

export async function loginToConnectyCube(
  email: string,
  password: string
): Promise<ConnectyCubeSession> {
  const CB = getConnectyCube();
  
  try {
    const session = await CB.auth.createSession({ email, password });
    const sessionData = session as any;
    
    currentSession = {
      token: sessionData.token,
      userId: sessionData.user_id || sessionData.userId,
    };
    
    // Store credentials in localStorage for re-authentication
    localStorage.setItem('connectyCubeCredentials', JSON.stringify({ email, password }));
    
    
    // Try to get current user info (may fail if Users API is not enabled)
    try {
      const user = await CB.users.get({ id: currentSession.userId });
      const userData = user as any;
      currentUser = {
        id: userData.id || userData.user_id,
        login: userData.login || userData.email,
        email: userData.email || userData.login,
        fullName: userData.full_name || userData.name,
        customData: userData.custom_data || userData.customData,
      };
    } catch (userError) {
      console.warn('Could not fetch user info (Users API may be disabled):', userError);
      // Continue without user info - session is still valid
      currentUser = {
        id: currentSession.userId,
        login: email,
        email: email,
        fullName: email.split('@')[0],
        customData: null,
      };
    }
    
    
    // Connect to chat for real-time messaging
    await connectToChat();
    
    return currentSession;
  } catch (error) {
    console.error('ConnectyCube login failed:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to login to ConnectyCube: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function connectToChat(): Promise<void> {
  const CB = getConnectyCube();
  
  if (isChatConnected) {
    return;
  }
  
  try {
    await CB.chat.connect({
      userId: currentSession!.userId,
      password: currentSession!.token,
    });
    isChatConnected = true;
  } catch (error) {
    console.error('Failed to connect to chat:', error);
    // Don't throw error - chat connection is optional for basic functionality
  }
}

export function disconnectFromChat(): void {
  const CB = getConnectyCube();
  
  if (isChatConnected) {
    try {
      CB.chat.disconnect();
      isChatConnected = false;
    } catch (error) {
      console.error('Error disconnecting from chat:', error);
    }
  }
}

export function isChatConnectionActive(): boolean {
  return isChatConnected;
}

export async function logoutFromConnectyCube(): Promise<void> {
  const CB = getConnectyCube();
  
  try {
    // Disconnect from chat first
    disconnectFromChat();
    
    if (currentSession) {
      await CB.auth.destroySession();
    }
  } catch (error) {
    console.error('ConnectyCube logout error:', error);
  } finally {
    currentUser = null;
    currentSession = null;
  }
}

export async function getCurrentUser(): Promise<ConnectyCubeUser | null> {
  if (currentUser) {
    return currentUser;
  }
  
  if (currentSession) {
    try {
      const CB = getConnectyCube();
      const user = await CB.users.get({ id: currentSession.userId });
      const userData = user as any;
      currentUser = {
        id: userData.id || userData.user_id,
        login: userData.login || userData.email,
        email: userData.email || userData.login,
        fullName: userData.full_name || userData.name,
        customData: userData.custom_data || userData.customData,
      };
      return currentUser;
    } catch (error) {
      console.error('Failed to get current user:', error);
      // Return a basic user object from session data
      currentUser = {
        id: currentSession.userId,
        login: 'admin',
        email: 'admin@ssn.com',
      };
      return currentUser;
    }
  }
  
  // Final fallback: return basic admin user if no session
  console.warn('No session available, returning default admin user');
  return {
    id: 14922637,
    login: 'admin',
    email: 'admin@ssn.com',
  };
}

export function getCurrentUserId(): number | null {
  if (currentSession?.userId) {
    return currentSession.userId;
  }
  
  // Fallback: try to get from SDK session
  try {
    const CB = getConnectyCube();
    const session = CB.service.getSession();
    if (session && session.user_id) {
      return session.user_id;
    }
  } catch (error) {
    console.error('Failed to get user ID from SDK session:', error);
  }
  
  // Final fallback: return admin ID
  console.warn('Could not get user ID from any source, returning admin ID');
  return 14922637;
}

export function getCurrentSession(): ConnectyCubeSession | null {
  return currentSession;
}

export function isAuthenticated(): boolean {
  return currentSession !== null;
}

export async function ensureAuthenticated(): Promise<void> {
  // Wait for session restoration to complete
  if (sessionRestorationPromise) {
    await sessionRestorationPromise;
  }
  
  if (!isAuthenticated()) {
    throw new Error('Not authenticated with ConnectyCube');
  }
}
