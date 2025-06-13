import { Typing } from "@/components/typing";
import { finishTypingTest, startTypingTest } from "./typing-test-actions";

export default function Home() {
  // TODO
  // - fetch words from db
  // - game state tracking (start/end)

  return (
    <div className="flex flex-col items-center justify-around h-full flex-grow">
      <Typing
        text={
          "conspired to get on uh if i mean percentages are stylized medieval life if ive got a pik activity all of the towns have a real quiet estuary of modern hotel style security are also reports on trade so good slate and open about uh oh go buy uh its"
        }
        onStart={startTypingTest}
        onFinish={finishTypingTest}
      />
    </div>
  );
}
