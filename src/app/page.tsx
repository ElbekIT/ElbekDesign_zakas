import ListInput from "@/components/ListInput";
function Home() {
  return (
    <div className="flex items-center gap-5 justify-center flex-col mt-10 ">
      <div>
        <h2 className="text-5xl font-bold ">Elbek Design</h2>
      </div>
      <form
        className="grid md:grid-cols-2 grid-cols-1 md:grid-rows-2 gap-2 items-start justify-end md:-m-40 w-full max-w-3xl"
        method="post"
      >
        <ListInput />
      </form>
    </div>
  );
}

export default Home;
