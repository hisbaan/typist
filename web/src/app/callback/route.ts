import { config } from "@/config";
import { handleAuth, getWorkOS } from "@workos-inc/authkit-nextjs";

export const GET = handleAuth({
  onSuccess: async ({ user }) => {
    const organizationId = config.WORKOS_ORG_ID;
    const workos = getWorkOS();

    workos.userManagement.createOrganizationMembership({
      organizationId,
      userId: user.id,
    });
  },
});
