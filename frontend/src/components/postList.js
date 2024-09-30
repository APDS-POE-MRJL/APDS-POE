import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";  // Corrected 'Link'
import "../App.css";

const Post = (props) => (
    <tr>
      <td>{props.post.user}</td>
      <td>{props.post.content}</td>
      <td>
        {props.post.image && (
          <img
            src={`data:image/jpeg;base64,${props.post.image}`}  // Corrected string template usage
            alt="Post Image"
            style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}  // Corrected style object
          />
        )}
      </td>
      <td>
        <button
          className="btn btn-link"
          onClick={() => props.deletePost(props.post._id)}  // Corrected onClick syntax
        >
          Delete
        </button>
      </td>
    </tr>
  );

  export default function PostList() {
    const [posts, setPosts] = useState([]);

    // This method fetches from the DB
    useEffect(() => { // Correct the arrow function syntax
        async function getPosts() {
            const response = await fetch('https://localhost:3000/post/');

            if (!response.ok) { // Fixed typo: 'resposne' -> 'response'
                const message = `An error occurred: ${response.statusText}`; // Use backticks for template literals
                window.alert(message);
                return;
            }     

            const posts = await response.json();
            setPosts(posts); // Set the posts array in state
        }

        getPosts();

        return; // This return is optional; no cleanup function is necessary here
    }, []); // Corrected dependency array; use an empty array to only call getPosts once

    return (
        <div>
            {posts.length > 0 ? (
                <ul>
                    {posts.map(post => (
                        <li key={post.id}>{post.content}</li> // Adjust this to your actual post data structure
                    ))}
                </ul>
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );


async function deletePost(id) {
    const token = localStorage.getItem("jwt");
    await fetch('https://localhost:3000/post/${id}', {
        method: "DELETE",
        headers: {
            "Authorization": 'Bearer ${token}',  
        },
    });

    const newPosts = posts.filter((e1) => e1._id !== id);
    setPosts(newPosts)
}

function PostList() {
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

return(
    <body>
        <div className="container">
            <h1 className="header">APDS Notice board</h1>
            <table className="table table-striped" style={{ marginTop: 20}}>
                <thread>
                    <tr>
                        <th>User</th>
                        <th>Caption</th>
                        <th>Image</th>
                        <th>Actions</th>  {/*Actions for that button go here*/}
                    </tr>
                </thread>
            </table>
        </div>
    </body>
);
}