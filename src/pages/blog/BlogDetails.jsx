// src/pages/BlogDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../../config";
import { FaThumbsUp, FaShareAlt } from "react-icons/fa";
import DOMPurify from "dompurify";

function BlogDetails() {
  const { baseUrl } = config;
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);
  const navigate = useNavigate();

  // Fetch single post (blog or video)
  const fetchPost = async () => {
    try {
      let res;
      try {
        res = await axios.get(`${baseUrl}/educations/blogs/${slug}/`);
      } catch {
        res = await axios.get(`${baseUrl}/educations/videos/${slug}/`);
      }
      setPost(res.data);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent posts
  const fetchRecentPosts = async () => {
    try {
      const [blogRes, videoRes] = await Promise.all([
        axios.get(`${baseUrl}/educations/blogs/`),
        axios.get(`${baseUrl}/educations/videos/`),
      ]);
      const blogs = blogRes.data.results || blogRes.data;
      const videos = videoRes.data.results || videoRes.data;

      const publishedBlogs = blogs.filter((b) => b.status === "published");
      const publishedVideos = videos.filter((v) => v.status === "published");

      const merged = [...publishedBlogs, ...publishedVideos];
      merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setRecentPosts(merged.slice(0, 15)); // ✅ latest 15
    } catch (error) {
      console.error("Error fetching recent posts:", error);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchRecentPosts();
  }, [slug]); //eslint-disable-line

  // ✅ Like toggle
  const handleLike = async () => {
    if (!post) return;
    try {
      const type = post.video_url ? "videos" : "blogs";
      const token = localStorage.getItem("access_token");

      const res = await axios.post(
        `${baseUrl}/educations/${type}/${slug}/like/`,
        {},
        token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {}
      );

      setPost({
        ...post,
        likes: res.data.likes,
        is_liked: res.data.liked,
      });
    } catch (error) {
      console.error("Error liking post:", error);
      alert("You need to login to like this post.");
    }
  };

  // ✅ Share system
  const handleShare = async () => {
    const postUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url: postUrl });
      } else {
        await navigator.clipboard.writeText(postUrl);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // ✅ Video / Image render
  const renderMedia = () => {
    if (post.video_url) {
      if (
        post.video_url.includes("youtube.com") ||
        post.video_url.includes("youtu.be")
      ) {
        const embedUrl = post.video_url
          .replace("watch?v=", "embed/")
          .replace("youtu.be/", "youtube.com/embed/");
        return (
          <div className="mb-4 ratio ratio-16x9">
            <iframe src={embedUrl} title={post.title} allowFullScreen />
          </div>
        );
      }
      return (
        <div className="mb-4 position-relative">
          <video
            controls
            poster={post.thumbnail}
            style={{ width: "100%", borderRadius: "8px" }}
          >
            <source src={post.video_url} type="video/mp4" />
          </video>
        </div>
      );
    }
    return (
      <img
        src={post.feature_image}
        alt={post.title}
        className="img-fluid rounded mb-4"
      />
    );
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found!</p>;

  return (
    <div className="container my-4">
      <h1 className="mb-3" style={{ fontWeight: "bold", fontFamily: "poppins" }}>
            {post.title}
          </h1>

          {renderMedia()}
      <div className="row">
        {/* Main content */}
        <div className="col-md-8 me-auto">
          

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-3">
              {post.tags.map((tag, i) => (
                <span
                  key={tag.id || i}
                  className="badge me-1"
                  style={{ backgroundColor: "#A4449D" }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          {post.excerpt && <p className="lead">{post.excerpt}</p>}
          <div className="content-body">
            {post.content?.includes("<p>") ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post.content),
                }}
              />
            ) : (
              (post.content || post.description)
                .split(/\n+/)
                .map((para, i) => (
                  <p key={i} style={{ textAlign: "justify", lineHeight: "1.7em" }}>
                    {para}
                  </p>
                ))
            )}
          </div>

          {/* Meta info */}
          <div className="mt-4">
            <small className="text-muted">
              {new Date(post.created_at).toLocaleDateString()} |{" "}
              {post.category?.title} | Views: {post.number_of_reads} | Likes:{" "}
              {post.likes}
            </small>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-3 mt-3">
            <button
              className={`btn ${post.is_liked ? "btn-success" : "btn-primary"}`}
              onClick={handleLike}
            >
              <FaThumbsUp className="me-2" />
              {post.is_liked ? "Liked" : "Like"} ({post.likes})
            </button>
            <button className="btn btn-secondary" onClick={handleShare}>
              <FaShareAlt className="me-2" />
              Share
            </button>
          </div>
        </div>

        {/* Sidebar: Recent posts */}
        <div className="col-md-3">
          <h4
            className="mb-3"
            style={{
              backgroundColor: "#9eeef1ff",
              padding: "5px",
              borderRadius: "3px",
            }}
          >
            Recent Posts
          </h4>
          <ul className="list-unstyled">
            {recentPosts.map((rp) => (
              <li
                key={rp.id}
                className="d-flex align-items-center mb-3"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/blog/${rp.slug}`)}
              >
                <img
                  src={rp.feature_image || rp.thumbnail}
                  alt={rp.title}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    marginRight: "10px",
                  }}
                />
                <span style={{ fontSize: "0.9rem" }}>{rp.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
