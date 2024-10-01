import React, { useEffect, useState } from "react";
import "../App.css";

const Post = (props) => (
  <tr>
    <td>{props.post.user}</td>
    <td>{props.post.content}</td>
    <td>
      {props.post.image && (
        <img
          src={`data:image/jpeg;base64,${props.post.image}`}
          alt="Post by user"  // More meaningful alt text
          style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
        />
      )}
    </td>
    <td>
      <button
        className="btn btn-link"
        onClick={() => props.deletePost(props.post._id)}
      >
        Delete
      </button>
    </td>
  </tr>
);

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      const response = await fetch('http://localhost:3000/post/');

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const posts = await response.json();
      setPosts(posts);
    }

    getPosts();
  }, []);

  async function deletePost(id) {
    const token = localStorage.getItem("jwt");
    await fetch(`http://localhost:3000/post/${id}`, {  // Corrected template literals
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,  // Corrected template literals
      },
    });

    const newPosts = posts.filter((e1) => e1._id !== id);
    setPosts(newPosts);
  }

  return (
    <div className="container">
      <h1 className="header">APDS Notice board</h1>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Caption</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <Post
              post={post}
              deletePost={() => deletePost(post._id)}
              key={post._id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
