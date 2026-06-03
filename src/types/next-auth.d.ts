import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  /**
   * Thêm thuộc tính jwt vào đối tượng Session mặc định.
   */
  interface Session {
    jwt?: string;
    user: {
      id: string;
    } & DefaultSession['user'];
  }

  /**
   * Thêm thuộc tính jwt vào đối tượng JWT mặc định.
   */
  interface JWT extends DefaultJWT {
    jwt?: string;
  }
}