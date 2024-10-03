 return(
<div className= "container">
    <h3 className="header">Create Post</h3>
    <form onSubmit = {onSubmit} className="form">
        <div className="form-group">
            <label htmlFor="user">User</label>
            <input 
            type="text" 
            className="form-control" 
            id="user" 
            value={form.user} 
            disabled
            />
        </div>
        <div className="form-group">
            <label htmlFor="content">Content</label>
            <input 
            type="text" 
            className="form-control" 
            id="content" 
            value={form.caption} 
            onChange={(e) => updateForm({ caption: e.target.value })}
            />
            </div>
            <div className="form-group">
                <label htmlFor="image">Image</label>
                <input 
                type="file" 
                className="form-control" 
                id="image" 
                accept="image/*"
                onChange={handleImageChange}
                />
                </div>
                <div className="form-group">
                    <input type="submit" 
                    className="btn btn-primary" 
                    value="Create Post"
                    />
                    </div>
                    </form>
                    </div>

 );