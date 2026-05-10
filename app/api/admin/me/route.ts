import { adminErrorResponse, requireAdminRequest } from "@/lib/admin";

export async function GET(request: Request) {
  try {
    const context = await requireAdminRequest(request);
    return Response.json({ isAdmin: true, email: context.email });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
