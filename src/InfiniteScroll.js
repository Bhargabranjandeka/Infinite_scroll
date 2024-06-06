import { useEffect, useState, useRef } from "react";
import Post from "./Post";
const itemtoLoad = 4;
export default function InfiniteScroll() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  let ObserveTarget = useRef();

  const Fetchingdata = async function () {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!res.ok) throw new Error("Error loading data");
      const data = await res.json();
      let start = page * itemtoLoad;
      let end = start + itemtoLoad;
      let Itemlist = data.slice(start, end);
      console.log(Itemlist);
      setPosts((posts) => [...posts, ...Itemlist]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          Fetchingdata();
          setPage((page) => page + 1);
        }
      },
      { threshold: 1 }
    );

    if (ObserveTarget.current) {
      observer.observe(ObserveTarget.current);
    }
  }, [ObserveTarget]);

  return (
    <div>
      <div className="wrapper">
        <ul className="postList">
          {posts.map((post) => (
            <Post post={post} />
          ))}
        </ul>
      </div>
      <div ref={ObserveTarget}></div>
    </div>
  );
}
