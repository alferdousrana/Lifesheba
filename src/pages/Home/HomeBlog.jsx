// src/pages/HomeBlog.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../config";
import { useNavigate } from "react-router-dom";
import { FaPlayCircle } from "react-icons/fa";
import HoverZoom from "../components/HoverZoom";

function HomeBlog() {
    const { baseUrl } = config;
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            axios.get(`${baseUrl}/educations/blogs/`),
            axios.get(`${baseUrl}/educations/videos/`),
        ])
            .then(([blogRes, videoRes]) => {
                const blogData = blogRes.data.results || blogRes.data;
                const videoData = videoRes.data.results || videoRes.data;

                const publishedBlogs = blogData.filter((b) => b.status === "published");
                const publishedVideos = videoData.filter((v) => v.status === "published");

                const merged = [...publishedBlogs, ...publishedVideos];
                merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                setPosts(merged.slice(0, 10));
            })
            .catch((err) => console.error("Failed to fetch posts:", err));
    }, [baseUrl]);

    const handlePostClick = async (post) => {
        try {
            const type = post.video_url ? "videos" : "blogs";
            await axios.post(`${baseUrl}/educations/${type}/${post.slug}/increase_views/`);
        } catch (err) {
            console.error("Error increasing views:", err);
        }
        navigate(`/blog/${post.slug}`);
    };

    // 👉 এখানে আমরা posts কে দুইবার repeat করব
    const repeatedPosts = [...posts, ...posts];

    return (
        <div className="container my-5">
            <h3 className="mb-4">Recent Blogs & Videos</h3>
            <div className="scroll-container">
                <div className="scroll-content my-2">
                    {repeatedPosts.map((post, index) => (
                        <div
                            key={index}
                            className="card shadow-sm hover-parent"
                            onClick={() => handlePostClick(post)}
                            style={{
                                minWidth: "250px",
                                maxWidth: "250px",
                                flexShrink: 0,
                                margin: "0 10px",
                                borderRadius: "12px",
                                backgroundColor: "#fff",
                                cursor: "pointer",
                            }}
                        >
                            <div className="position-relative">
                            <HoverZoom scale={1.1} triggerParentHover={true}>
                                <img
                                    src={post.feature_image || post.thumbnail}
                                    alt={post.title}
                                    className="card-img-top"
                                    style={{
                                        height: "150px",
                                        objectFit: "cover",
                                        borderTopLeftRadius: "12px",
                                        borderTopRightRadius: "12px",
                                    }}
                                />
                                {"video_url" in post && (
                                    <FaPlayCircle
                                        size={50}
                                        className="position-absolute top-50 start-50 translate-middle"
                                        style={{
                                            color: "red",
                                            background: "white",
                                            borderRadius: "50%",
                                        }}
                                    />
                                )}
                                </HoverZoom>
                            </div>

                            <div className="card-body">
                                <h6 className="card-title">{post.title}</h6>
                                <p style={{ fontSize: "13px", color: "#555" }}>
                                    {post.excerpt
                                        ? post.excerpt.slice(0, 100) + "..."
                                        : post.description?.slice(0, 100) + "..."}
                                </p>
                                <small style={{ fontSize: "12px", color: "#888" }}>
                                    {post.category?.title || "Uncategorized"}
                                </small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Auto-scroll animation */}
            <style>
                {`
          .scroll-container {
            overflow: hidden;
            position: relative;
            width: 100%;
          }

          .scroll-content {
            display: flex;
            width: max-content;
            animation: scroll-left 30s linear infinite;
          }

          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .scroll-content:hover {
            animation-play-state: paused;
          }
        `}
            </style>
        </div>
    );
}

export default HomeBlog;
