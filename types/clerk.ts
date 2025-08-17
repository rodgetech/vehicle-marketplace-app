export interface UserMetadata {
  profileComplete?: boolean;
  district?: string;
  userType?: 'buyer' | 'seller' | 'both';
  displayName?: string;
}

export interface UserPublicMetadata extends UserMetadata {}
export interface UserUnsafeMetadata extends UserMetadata {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: UserPublicMetadata;
  }
}