import { getSignInUrl, withAuth } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import { FaUser } from "react-icons/fa6";
import Image from "next/image";

export const Avatar: React.FC = async () => {
  const { user: workosUser } = await withAuth();
  const signInUrl = await getSignInUrl();

  if (!workosUser) {
    return (
      <Link href={signInUrl}>
        <FaUser className="size-6" />
      </Link>
    );
  }

  return workosUser.profilePictureUrl ? (
    <Image
      className="size-6 rounded-full border-[1.5px] border-neutral-500"
      src={workosUser.profilePictureUrl}
      alt={"Avatar"}
      width={50}
      height={50}
    />
  ) : (
    <FaUser className="size-6" />
  );
};
