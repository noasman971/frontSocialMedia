import {PostList} from "./features/posts/PostList.tsx";

function App() {
  return (
    <div className="min-h-screen bg-bg text-text-primary flex justify-center">
      {/* Central Column*/}
      <main className="w-full max-w-[800px] pt-8 px-4 flex flex-col">

        {/* Feed / Followed navigation*/}
        <div className="flex items-center gap-6 pb-6 border-b border-border">
          <button className="text-base font-bold text-text-primary cursor-pointer border-b-2 border-text-primary pb-1">
            Pour vous
          </button>
          <button className="text-base font-medium text-text-secondary hover:text-text-primary cursor-pointer pb-1">
            Suivi(e)
          </button>
        </div>

        {/* TODO: Stories block ? */}
        <section className="py-4 border-b border-border">
          <div className="text-xs text-text-secondary">
            {/* Nothing for now */}
          </div>
        </section>

        {/* PostList */}
        <section className="pt-4">
          <PostList />
        </section>
      </main>
    </div>
  );
}

export default App;
