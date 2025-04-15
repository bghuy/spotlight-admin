import Cookies from "js-cookie"

// Auth0 configuration
export const auth0Config = {
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "",
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || "",
  clientSecret: process.env.AUTH0_CLIENT_SECRET || "", // This should be server-side only
  redirectUri: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "",
  audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || "",
}

// Token interface
interface TokenResponse {
  access_token: string
  id_token: string
  expires_in: number
  token_type: string
}

// Exchange authorization code for access token
export const exchangeCodeForToken = async (code: string): Promise<TokenResponse> => {
  try {
    // In a real application, this should be a server-side API call
    // For demo purposes, we're simulating the token exchange on the client

    // In production, NEVER expose your client secret on the client side
    // This should be a server-side API call to your backend

    // Simulate API call to exchange code for token
    console.log("Exchanging code for token...")

    // For demo purposes, we'll create a mock token
    const mockToken: TokenResponse = {
      access_token: `mock_access_token_${Date.now()}`,
      id_token: `mock_id_token_${Date.now()}`,
      expires_in: 86400, // 24 hours
      token_type: "Bearer",
    }

    // Store tokens in cookies
    const expiresAt = new Date(Date.now() + mockToken.expires_in * 1000)
    Cookies.set("access_token", mockToken.access_token, { expires: expiresAt, secure: true, sameSite: "lax" })
    Cookies.set("id_token", mockToken.id_token, { expires: expiresAt, secure: true, sameSite: "lax" })

    return mockToken

    /*
    // Real implementation would look like this:
    const tokenResponse = await fetch(`https://${auth0Config.domain}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: auth0Config.clientId,
        client_secret: auth0Config.clientSecret, // This should be server-side only!
        code,
        redirect_uri: auth0Config.redirectUri
      })
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData: TokenResponse = await tokenResponse.json()

    // Store tokens in cookies
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000)
    Cookies.set('access_token', tokenData.access_token, { expires: expiresAt, secure: true, sameSite: 'lax' })
    Cookies.set('id_token', tokenData.id_token, { expires: expiresAt, secure: true, sameSite: 'lax' })

    return tokenData
    */
  } catch (error) {
    console.error("Error exchanging code for token:", error)
    throw error
  }
}

// Get the current user's access token
export const getAccessToken = (): string | null => {
  return Cookies.get("access_token") || null
}

// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAccessToken()
}

// Logout the user
export const logout = () => {
  Cookies.remove("auth_token")
  window.location.href = "/login"
}
