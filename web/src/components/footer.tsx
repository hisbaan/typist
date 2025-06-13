export const Footer: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 border-t border-neutral-600 pt-3 items-center text-neutral-500">
      typist
      <div className="text-xs">&copy; {new Date().getFullYear()} Hisbaan Noorani. All Rights Reserved</div>
    </div>
  );
}
