import {useParams} from "react-router-dom";

function PostDetailPage() {

  const { postTitle } = useParams();



  return (
    <div>PostDetailPage</div>
  );
}

export default PostDetailPage;