import Link from "next/link";

export const TopNav: React.FC = () => {
  return (
    <>
      <div className="flex h-20 w-full items-center justify-between text-neutral-500">
        <Link className="transition-colors hover:text-neutral-400" href="/">
          typist
        </Link>
        <div className="flex gap-5">
          {/*   user/account management chip */}
          {/*   scores chip */}
          {/*   settings */}
          {/*   <Link className="transition-colors hover:text-neutral-400" href="/"> */}
          {/*     home */}
          {/*   </Link> */}
          {/*   <Link */}
          {/*     className="transition-colors hover:text-neutral-400" */}
          {/*     href="/scoreboard" */}
          {/*   > */}
          {/*     scoreboard */}
          {/*   </Link> */}
        </div>
      </div>
    </>
  );
}
