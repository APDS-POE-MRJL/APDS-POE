import React, {useEffect, useState} from "react";
import { link } from "react-router-dom";

export default function PostList(){
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