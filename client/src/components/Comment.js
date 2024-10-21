import { getDate } from "../utils/utils";
import UpvoteButton from "./UpvoteButton";
import AppStateContext from "../context/AppStateContext";
import { useContext } from "react";
export default function Comment({ comment }) {
  const { isLoggedIn } = useContext(AppStateContext);
  return (
    <div style={{borderTop: "1px solid",
    display: "flex",
    justifyContent: "space-between"
  }}>{comment.text} <div>{comment.user.username}<br />{getDate(new Date(comment.date_created))}<br />votes: {comment.num_votes}<br />{isLoggedIn && <UpvoteButton id={comment._id}/>}</div></div>
  );
}