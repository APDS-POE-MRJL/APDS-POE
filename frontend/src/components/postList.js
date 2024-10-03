import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Post = (props) => (
  <tr>
    <td>{props.post.user}</td>
    <td>{props.post.content}</td>
    <td>
      {props.post.image && (
        <img
          src={`data:image/jpeg;base64,${props.post.image}`}
          alt="Post Image"
          style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "cover" }}
        />
      )}
    </td>
    <td>
      <button
        className="btn btn-link"
        onClick={() => props.deletePost(props.post._id)} // Fixed this line
      >
        Delete
      </button>
    </td>
  </tr>
);

export default function PostList() {
  const [posts, setPosts] = useState([]); // Fixed useState

  useEffect(() => {
    async function getPosts() {
<<<<<<< Updated upstream
      const response = await fetch('https://localhost:3000/post/');

=======
      const response = await fetch("http://localhost:3000/posts/");
    
>>>>>>> Stashed changes
      if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        window.alert(message);
        return;
      }
  
      const posts = await response.json();
      setPosts(posts);
    }

    getPosts();
  }, [posts.length]); // Fixed dependency array
  
  async function deletePost(id) {
<<<<<<< Updated upstream
    const token = localStorage.getItem("jwt");
    await fetch(`https://localhost:3000/post/${id}`, {  // Corrected template literals
=======
    const token = localStorage.getItem("JWT");
    await fetch(`http://localhost:3000/posts/${id}`, {
>>>>>>> Stashed changes
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const newPosts = posts.filter((post) => post._id !== id);
    setPosts(newPosts);
  }
    
  function postList() {
    return posts.map((post) => {
      return (
        <Post
          post={post}
          deletePost={() => deletePost(post._id)}
          key={post._id}
        />
      );
    });
  }
  
  return (
    <body>
    <div className="container mt-4">
      <h2 className="text-center mb-4">APDS Notice Board</h2>
      <table className="table table-hover">
        <thead className="thead-light">
          <tr>
            <th>User</th>
            <th>Caption</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{postList()}</tbody>
      </table>
    </div>
    </body>
  );
}
